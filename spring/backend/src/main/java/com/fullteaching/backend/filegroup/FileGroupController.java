package com.fullteaching.backend.filegroup;

import java.io.IOException;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.course.CourseRepository;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.file.FileRepository;
import com.fullteaching.backend.security.AuthorizationService;

@RestController
@RequestMapping("/api-files")
public class FileGroupController {
	
	@Autowired
	private FileGroupRepository fileGroupRepository;
	
	@Autowired
	private FileRepository fileRepository;
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private CourseDetailsRepository courseDetailsRepository;
	
	@Autowired
	private AuthorizationService authorizationService;
	
	@Value("${profile_stage}")
    private String profileStage;
	
	//ONLY ON PRODUCTION
	@Autowired
	private AmazonS3 amazonS3;
	
    @Value("${aws_namecard_bucket}")
    private String bucketAWS;
    //ONLY ON PRODUCTION
	
	private static final Path FILES_FOLDER = Paths.get(System.getProperty("user.dir"), "files");
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public ResponseEntity<Object> newFileGroup(@RequestBody FileGroup fileGroup, @PathVariable(value="id") String courseDetailsId) {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_i = -1;
		try {
			id_i = Long.parseLong(courseDetailsId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		CourseDetails cd = courseDetailsRepository.findOne(id_i);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(cd, cd.getCourse().getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			//fileGroup is a root FileGroup
			if (fileGroup.getFileGroupParent() == null){
				cd.getFiles().add(fileGroup);
				/*Saving the modified courseDetails: Cascade relationship between courseDetails
				  and fileGroups will add the new fileGroup to FileGroupRepository*/
				courseDetailsRepository.save(cd);
				/*Entire courseDetails is returned*/
				return new ResponseEntity<>(cd, HttpStatus.CREATED);
			}
			
			//fileGroup is a child of an existing FileGroup
			else{
				FileGroup fParent = fileGroupRepository.findOne(fileGroup.getFileGroupParent().getId());
				if(fParent != null){
					fParent.getFileGroups().add(fileGroup);
					/*Saving the modified parent FileGroup: Cascade relationship between FileGroup and 
					 its FileGroup children will add the new fileGroup to FileGroupRepository*/
					fileGroupRepository.save(fParent);
					CourseDetails cd2 = courseDetailsRepository.findOne(id_i);
					/*Entire courseDetails is returned*/
					return new ResponseEntity<>(cd2, HttpStatus.CREATED);
				}else{
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}
		}
	}
	
	
	@RequestMapping(value = "/edit/file-group/course/{courseId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifyFileGroup(@RequestBody FileGroup fileGroup, @PathVariable(value="courseId") String courseId) {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_course = -1;
		try{
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupRepository.findOne(fileGroup.getId());
			
			if (fg != null){
				fg.setTitle(fileGroup.getTitle());
				fileGroupRepository.save(fg);
				
				//Returning the root FileGroup of the added file
				return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED); 
			}
		}
	}
	
	
	@RequestMapping(value = "/edit/file-order/course/{courseId}/file/{fileId}/from/{sourceID}/to/{targetId}/pos/{position}", method = RequestMethod.PUT)
	public ResponseEntity<Object> editFileOrder(
			@PathVariable(value="courseId") String courseId,
			@PathVariable(value="fileId") String fileId,
			@PathVariable(value="sourceID") String sourceId,
			@PathVariable(value="targetId") String targetId,
			@PathVariable(value="position") String position
		) {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_course = -1;
		long id_file = -1;
		long id_source = -1;
		long id_target = -1;
		int pos = 0;
		try{
			id_course = Long.parseLong(courseId);
			id_file = Long.parseLong(fileId);
			id_source = Long.parseLong(sourceId);
			id_target = Long.parseLong(targetId);
			pos = Integer.parseInt(position);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup sourceFg = fileGroupRepository.findOne(id_source);
			FileGroup targetFg = fileGroupRepository.findOne(id_target);
			File fileMoved = fileRepository.findOne(id_file);
			
			sourceFg.getFiles().remove(fileMoved);
			targetFg.getFiles().add(pos, fileMoved);
			
			sourceFg.updateFileIndexOrder();
			targetFg.updateFileIndexOrder();
			
			List<FileGroup> l = new ArrayList<>();
			l.add(sourceFg);
			l.add(targetFg);
			fileGroupRepository.save(l);
			
			//Returning the FileGroups of the course
			return new ResponseEntity<>(c.getCourseDetails().getFiles(), HttpStatus.OK);
		}
	}
	
	
	@RequestMapping(value = "/edit/file/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.PUT)
	public ResponseEntity<Object> modifyFile(
			@RequestBody File file,
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId) 
	{
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_fileGroup = -1;
		long id_course = -1;
		try{
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupRepository.findOne(id_fileGroup);
			
			if (fg != null){
				for (int i = 0; i < fg.getFiles().size(); i++){
					if (fg.getFiles().get(i).getId() == file.getId()){
						fg.getFiles().get(i).setName(file.getName());
						fileGroupRepository.save(fg);
						//Returning the root FileGroup of the added file
						return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.OK);
					}
				}
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED); 
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED); 
			}
		}
	}
	
	
	@RequestMapping(value = "/delete/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteFileGroup(
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_fileGroup = -1;
		long id_course = -1;
		try{
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupRepository.findOne(id_fileGroup);
			
			if (fg != null){
				
				if (this.isProductionStage()){
					//Removing all the S3 stored files of the tree structure...
					for (File f : fg.getFiles()){
						this.productionFileDeletion(f.getNameIdent(), "/files");
					}
					this.recursiveS3StoredFileDeletion(fg.getFileGroups());
				}
				else {
					//Removing all the locally stored files of the tree structure...
					for (File f : fg.getFiles()){
						this.deleteStoredFile(f.getNameIdent());
					}
					this.recursiveLocallyStoredFileDeletion(fg.getFileGroups());
				}
				
				//It is necessary to remove the FileGroup from the CourseDetails that owns it
				CourseDetails cd = c.getCourseDetails();
				cd.getFiles().remove(fg);
				courseDetailsRepository.save(cd);
				fileGroupRepository.delete(fg);
				return new ResponseEntity<>(fg, HttpStatus.OK);
			}
			else{
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}
	
	
	@RequestMapping(value = "/delete/file/{fileId}/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<Object> deleteFile(
			@PathVariable(value="fileId") String fileId,
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_file = -1;
		long id_fileGroup = -1;
		long id_course = -1;
		try{
			id_file = Long.parseLong(fileId);
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = fileGroupRepository.findOne(id_fileGroup);
			
			if (fg != null){
				File file = null;
				for(File f : fg.getFiles()) {
			        if(f.getId() == id_file) {
			            file = f;
			            break;
			        }
			    }
				if (file != null){
					
					if (this.isProductionStage()){
						//ONLY ON PRODUCTION
						//Deleting S3 stored file...
						this.productionFileDeletion(file.getNameIdent(), "/files");
						//ONLY ON PRODUCTION
					} else {
						//ONLY ON DEVELOPMENT
						//Deleting locally stored file...
						this.deleteStoredFile(file.getNameIdent());
						//ONLY ON DEVELOPMENT
					}
					
					fg.getFiles().remove(file);
					fg.updateFileIndexOrder();
					
					fileGroupRepository.save(fg);
					return new ResponseEntity<>(file, HttpStatus.OK);
					
				}else{
					//The file to delete does not exist or does not have a fileGroup parent
					fileRepository.delete(id_file);
					return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
				}
			}else{
				//The fileGroup parent does not exist
				fileRepository.delete(id_file);
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
	}
	
	
	//Method to get the root FileGroup of a FileGroup tree structure, given a FileGroup
	private FileGroup getRootFileGroup(FileGroup fg) {
		while(fg.getFileGroupParent() != null){
			fg = fg.getFileGroupParent();
		}
		return fg;
	}
	
	
	//Delets all the real locally stored files given a list of FileGroups
	private void recursiveLocallyStoredFileDeletion(List<FileGroup> fileGroup){
		if (fileGroup != null){
			for (FileGroup fg : fileGroup){
				for (File f: fg.getFiles()){
					this.deleteStoredFile(f.getNameIdent());
				}
				this.recursiveLocallyStoredFileDeletion(fg.getFileGroups());
			}
		}
		return;
	}
	
	private void deleteStoredFile(String fileName){
		//Deleting stored file...
		try {
			Path path = Paths.get(FILES_FOLDER.toString(), fileName);
		    Files.delete(path);
		} catch (NoSuchFileException x) {
		    System.err.format("%s: no such" + " file or directory%n", Paths.get(FILES_FOLDER.toString(), fileName));
		} catch (DirectoryNotEmptyException x) {
		    System.err.format("%s not empty%n", Paths.get(FILES_FOLDER.toString(), fileName));
		} catch (IOException x) {
		    // File permission problems are caught here.
		    System.err.println(x);
		}
	}
	
	//ONLY ON PRODUCTION
	private void productionFileDeletion (String fileName, String s3Folder){
		String bucketName = this.bucketAWS + s3Folder;
        try {
        	this.amazonS3.deleteObject(new DeleteObjectRequest(bucketName, fileName));
        	System.out.println("S3 DELETION: File " + fileName + " deleted successfully");
        } catch (AmazonServiceException ase) {
            System.out.println("Caught an AmazonServiceException.");
            System.out.println("Error Message:    " + ase.getMessage());
            System.out.println("HTTP Status Code: " + ase.getStatusCode());
            System.out.println("AWS Error Code:   " + ase.getErrorCode());
            System.out.println("Error Type:       " + ase.getErrorType());
            System.out.println("Request ID:       " + ase.getRequestId());
        } catch (AmazonClientException ace) {
            System.out.println("Caught an AmazonClientException.");
            System.out.println("Error Message: " + ace.getMessage());
        }
	}
	
	//Delets all the real S3 stored files given a list of FileGroups
	private void recursiveS3StoredFileDeletion(List<FileGroup> fileGroup){
		if (fileGroup != null){
			for (FileGroup fg : fileGroup){
				for (File f: fg.getFiles()){
					this.productionFileDeletion(f.getNameIdent(), "/files");
				}
				this.recursiveS3StoredFileDeletion(fg.getFileGroups());
			}
		}
		return;
	}
	//ONLY ON PRODUCTION
	
	private boolean isProductionStage(){
		return this.profileStage.equals("prod");
	}

}
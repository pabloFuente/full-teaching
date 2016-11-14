package com.fullteaching.backend.filegroup;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.course.CourseRepository;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.file.FileRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/files")
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
	private UserComponent user;
	
	
	@RequestMapping(value = "/{id}", method = RequestMethod.POST)
	public ResponseEntity<CourseDetails> newFileGroup(@RequestBody FileGroup fileGroup, @PathVariable(value="id") String courseDetailsId) {
		checkBackendLogged();
		
		long id_i = -1;
		try {
			id_i = Long.parseLong(courseDetailsId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		CourseDetails cd = courseDetailsRepository.findOne(id_i);
		
		checkAuthorization(cd, cd.getCourse().getTeacher());
		
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
	
	
	@RequestMapping(value = "/file-group/{fileGroupId}/course/{courseDetailsId}", method = RequestMethod.POST)
	public ResponseEntity<FileGroup> newFile(
			@RequestBody File file, 
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseDetailsId") String courseDetailsId) {
		
		checkBackendLogged();
		
		long id_fileGroup = -1;
		long id_courseDetails = -1;
		try {
			id_fileGroup = Long.parseLong(fileGroupId);
			id_courseDetails = Long.parseLong(courseDetailsId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		CourseDetails cd = courseDetailsRepository.findOne(id_courseDetails);
		
		checkAuthorization(cd, cd.getCourse().getTeacher());
		
		FileGroup fg = fileGroupRepository.findOne(id_fileGroup);
		
		if (fg != null){
			fg.getFiles().add(file);
			fileGroupRepository.save(fg);
			
			//Returning the root FileGroup of the added file
			while (fg.getFileGroupParent() != null){
				fg = fg.getFileGroupParent();
			}
			return new ResponseEntity<>(fg, HttpStatus.CREATED);
		}
		else{
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@RequestMapping(value = "/delete/file/{fileId}/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<File> deleteFile(
			@PathVariable(value="fileId") String fileId,
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		this.checkBackendLogged();
		
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
		
		checkAuthorization(c, c.getTeacher());
		
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
				fg.getFiles().remove(file);
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
	
	@RequestMapping(value = "/delete/file-group/{fileGroupId}/course/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<FileGroup> deleteFileGroup(
			@PathVariable(value="fileGroupId") String fileGroupId,
			@PathVariable(value="courseId") String courseId
	) {
		
		this.checkBackendLogged();
		
		long id_fileGroup = -1;
		long id_course = -1;
		try{
			id_fileGroup = Long.parseLong(fileGroupId);
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		
		Course c = courseRepository.findOne(id_course);
		
		checkAuthorization(c, c.getTeacher());
		
		FileGroup fg = fileGroupRepository.findOne(id_fileGroup);
		
		if (fg != null){
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
	
	
	
	//Login checking method for the backend
	private ResponseEntity<Object> checkBackendLogged(){
		if (!user.isLoggedUser()) {
			System.out.println("Not user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		return null; 
	}
	
	//Authorization checking for editing and deleting courses (the teacher must own the Course)
	private ResponseEntity<Object> checkAuthorization(Object o, User u){
		if(o == null){
			//The object does not exist
			return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
		}
		if(!this.user.getLoggedUser().equals(u)){
			//The teacher is not authorized to edit it if he is not its owner
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); 
		}
		return null;
	}

}
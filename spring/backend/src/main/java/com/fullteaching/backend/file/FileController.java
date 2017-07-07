package com.fullteaching.backend.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.DirectoryNotEmptyException;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

//ONLY ON PRODUCTION
import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.Upload;
import org.springframework.beans.factory.annotation.Value;
//ONLY ON PRODUCTION

import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.course.CourseRepository;
import com.fullteaching.backend.filegroup.FileGroup;
import com.fullteaching.backend.filegroup.FileGroupRepository;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/api-load-files")
public class FileController {
	
	@Autowired
	private FileGroupRepository fileGroupRepository;
	
	@Autowired
	private FileRepository fileRepository;
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserComponent user;
	
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
	private static final Path PICTURES_FOLDER = Paths.get(System.getProperty("user.dir"), "pictures");

	@RequestMapping(value = "/upload/course/{courseId}/file-group/{fileGroupId}", method = RequestMethod.POST)
	public ResponseEntity<Object> handleFileUpload(
			MultipartHttpServletRequest request,
			@PathVariable(value="courseId") String courseId,
			@PathVariable(value="fileGroupId") String fileGroupId
		) throws IOException {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_course = -1;
		long id_fileGroup = -1;
		try {
			id_course = Long.parseLong(courseId);
			id_fileGroup = Long.parseLong(fileGroupId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> teacherAuthorized = authorizationService.checkAuthorization(c, c.getTeacher());
		if (teacherAuthorized != null) { // If the user is not the teacher of the course
			return teacherAuthorized;
		} else {
		
			FileGroup fg = null;
			Iterator<String> i = request.getFileNames();
			while (i.hasNext()) {
				String name = i.next();
				System.out.println("X - " + name);
				MultipartFile file = request.getFile(name);
				String fileName = file.getOriginalFilename();
			
				System.out.println("FILE: " + fileName);
			
				if (file.isEmpty()) {
					throw new RuntimeException("The file is empty");
				}
		
				if (!Files.exists(FILES_FOLDER)) {
					Files.createDirectories(FILES_FOLDER);
				}
				
				com.fullteaching.backend.file.File customFile = new com.fullteaching.backend.file.File(1, fileName);
				File uploadedFile = new File(FILES_FOLDER.toFile(), customFile.getNameIdent());
				
				file.transferTo(uploadedFile);
				
				if (this.isProductionStage()){
					//ONLY ON PRODUCTION
					try {
						this.productionFileSaver(customFile.getNameIdent(), "files", uploadedFile);
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						this.deleteLocalFile(uploadedFile.getName(), FILES_FOLDER);
						e.printStackTrace();
					}
					customFile.setLink("https://"+ this.bucketAWS +".s3.amazonaws.com/files/" + customFile.getNameIdent());
					this.deleteLocalFile(uploadedFile.getName(), FILES_FOLDER);
					//ONLY ON PRODUCTION
				} else {
					//ONLY ON DEVELOPMENT
					customFile.setLink(uploadedFile.getPath());
					//ONLY ON DEVELOPMENT
				}
				fg = fileGroupRepository.findOne(id_fileGroup);
				fg.getFiles().add(customFile);
				fg.updateFileIndexOrder();
				System.out.println("FILE SUCCESFULLY UPLOADED TO " + uploadedFile.getPath());
			}
			
			fileGroupRepository.save(fg);
			System.out.println("FINISHING METHOD!");
			return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.CREATED);
		}
	}

	
	@RequestMapping("/course/{courseId}/download/{fileId}")
	public void handleFileDownload(
			@PathVariable String fileId,
			@PathVariable(value="courseId") String courseId, 
			HttpServletResponse response)
		throws FileNotFoundException, IOException {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			response.sendError(401, "Not logged");
			return;
		};
		
		long id_course = -1;
		long id_file = -1;
		try {
			id_course = Long.parseLong(courseId);
			id_file = Long.parseLong(fileId);
		} catch(NumberFormatException e){
			response.sendError(422, "Invalid format");
			return;
		}
		
		Course c = courseRepository.findOne(id_course);
		
		ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorizationUsers(c, c.getAttenders());
		if (userAuthorized != null) { // If the user is not an attender of the course
			response.sendError(401, "Unauthorized");
			return;
		} else {
		
			com.fullteaching.backend.file.File f = fileRepository.findOne(id_file);
			
			if (f != null){
				if (this.isProductionStage()){
					//ONLY ON PRODUCTION
					this.productionFileDownloader(f.getNameIdent(), response);
					//ONLY ON PRODUCTION
				} else {
					//ONLY ON DEVELOPMENT
					Path file = FILES_FOLDER.resolve(f.getNameIdent());
		
					if (Files.exists(file)) {
						try {
							String fileExt = f.getFileExtension();
							response.setContentType(MimeTypes.getMimeType(fileExt));
									
							// get your file as InputStream
							InputStream is = new FileInputStream(file.toString());
							// copy it to response's OutputStream
							IOUtils.copy(is, response.getOutputStream());
							response.flushBuffer();
						} catch (IOException ex) {
							throw new RuntimeException("IOError writing file to output stream");
						}
						
					} else {
						response.sendError(404, "File" + f.getNameIdent() + "(" + file.toAbsolutePath() + ") does not exist");
					}
					//ONLY ON DEVELOPMENT
				}
			}
		}
	}
	
	
	@RequestMapping(value = "/upload/picture/{userId}", method = RequestMethod.POST)
	public ResponseEntity<Object> handlePictureUpload(
			MultipartHttpServletRequest request,
			@PathVariable(value="userId") String userId
		) throws IOException {
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		long id_user = -1;
		try {
			id_user = Long.parseLong(userId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		User u = userRepository.findOne(id_user);
		
		ResponseEntity<Object> userAuthorized = authorizationService.checkAuthorization(u, this.user.getLoggedUser());
		if (userAuthorized != null) { // If the user is not the teacher of the course
			return userAuthorized;
		} else {
		
			Iterator<String> i = request.getFileNames();
			while (i.hasNext()) {
				String name = i.next();
				System.out.println("X - " + name);
				MultipartFile file = request.getFile(name);
				System.out.println("PICTURE: " + file.getOriginalFilename());
				
				if (file.isEmpty()) {
					System.out.println("EXCEPTION!");	
					throw new RuntimeException("The picture is empty");
				}
		
				if (!Files.exists(PICTURES_FOLDER)) {			
					System.out.println("PATH CREATED FOR PICTURE");
					Files.createDirectories(PICTURES_FOLDER);
				}
				
				String encodedName = getEncodedPictureName(file.getOriginalFilename());
	
				File uploadedPicture = new File(PICTURES_FOLDER.toFile(), encodedName);
				file.transferTo(uploadedPicture);
				
				if (this.isProductionStage()){
					//ONLY ON PRODUCTION
					try {
						this.productionFileSaver(encodedName, "pictures", uploadedPicture);
						System.out.println("PICTURE SUCCESFULLY UPLOADED  TO S3");
					} catch (InterruptedException e) {
						// TODO Auto-generated catch block
						this.deleteLocalFile(uploadedPicture.getName(), PICTURES_FOLDER);
						e.printStackTrace();
					}
					this.deleteLocalFile(uploadedPicture.getName(), PICTURES_FOLDER);
					this.productionFileDeletion(this.getFileNameFromURL(u.getPicture()), "/pictures");
					u.setPicture("https://"+ this.bucketAWS +".s3.amazonaws.com/pictures/" + encodedName);
					//ONLY ON PRODUCTION
				} else {
					//ONLY ON DEVELOPMENT
					this.deleteLocalFile(this.getFileNameFromURL(u.getPicture()), PICTURES_FOLDER);
					u.setPicture("/assets/pictures/" + uploadedPicture.getName());
					
					System.out.println("PICTURE SUCCESFULLY UPLOADED  TO " + uploadedPicture.getPath());
					//ONLY ON DEVELOPMENT
				}
	
				userRepository.save(u);
			}
			
			return new ResponseEntity<>(u.getPicture(), HttpStatus.CREATED);
		}
	}
	
	
	
	
	//Method to get the root FileGroup of a FileGroup tree structure, given a FileGroup
	private FileGroup getRootFileGroup(FileGroup fg) {
		while(fg.getFileGroupParent() != null){
			fg = fg.getFileGroupParent();
		}
		return fg;
	}
	
	private String getFileExtension(String name){
		return name.substring(name.lastIndexOf('.') + 1);
	}
	
	private String getEncodedPictureName(String originalFileName){
		//Getting the image extension
		String picExtension = this.getFileExtension(originalFileName);
		//Appending a random integer to the name
		originalFileName += (Math.random() * (Integer.MIN_VALUE - Integer.MAX_VALUE));
		//Encoding original file name + random integer
		originalFileName = new BCryptPasswordEncoder().encode(originalFileName);
		//Deleting all non alphanumeric characters
		originalFileName = originalFileName.replaceAll("[^A-Za-z0-9\\$]", "");
		//Adding the extension
		originalFileName += "." + picExtension;
		return originalFileName;
	}
	
	//ONLY ON DEVELOPMENT
	/*private String developingImageSaver(File file) throws IllegalStateException, IOException{
		Path DEV_PIC_FOLDER = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/assets/pictures");
		if (!Files.exists(DEV_PIC_FOLDER)) {			
			Files.createDirectories(DEV_PIC_FOLDER);
		}
		String encodedName = getEncodedPictureName(file.getOriginalFilename());
		File uploadedPicture = new File(DEV_PIC_FOLDER.toFile(), encodedName);
		file.transferTo(uploadedPicture);
		return "/assets/pictures/" + encodedName;
	}*/
	//ONLY ON DEVELOPMENT
	
	//ONLY ON PRODUCTION
	private void productionFileSaver(String keyName, String folderName, File f) throws InterruptedException {
		String bucketName = this.bucketAWS + "/" + folderName;
		TransferManager tm = new TransferManager(this.amazonS3);        
        // TransferManager processes all transfers asynchronously, so this call will return immediately
        Upload upload = tm.upload(bucketName, keyName, f);
        try {
        	// Or you can block and wait for the upload to finish
        	upload.waitForCompletion();
        	System.out.println("Upload completed");
        } catch (AmazonClientException amazonClientException) {
        	System.out.println("Unable to upload file, upload was aborted.");
        	amazonClientException.printStackTrace();
        }
    }
	
	private void productionFileDownloader(String fileName, HttpServletResponse response) {
		String bucketName = this.bucketAWS + "/files";
        try {
            System.out.println("Downloading an object");
            S3Object s3object = this.amazonS3.getObject(new GetObjectRequest(bucketName, fileName));
            System.out.println("Content-Type: "  + s3object.getObjectMetadata().getContentType());
            
            if (s3object != null) {
    			try {
    				String fileExt = this.getFileExtension(fileName);
    				response.setContentType(MimeTypes.getMimeType(fileExt));
    				InputStream objectData = s3object.getObjectContent();
    				IOUtils.copy(objectData, response.getOutputStream());
    				response.flushBuffer();
    				objectData.close();
    			} catch (IOException ex) {
    				throw new RuntimeException("IOError writing file to output stream");
    			}
    		}
            
        } catch (AmazonServiceException ase) {
            System.out.println("Caught an AmazonServiceException, which" +
            		" means your request made it " +
                    "to Amazon S3, but was rejected with an error response" +
                    " for some reason.");
            System.out.println("Error Message:    " + ase.getMessage());
            System.out.println("HTTP Status Code: " + ase.getStatusCode());
            System.out.println("AWS Error Code:   " + ase.getErrorCode());
            System.out.println("Error Type:       " + ase.getErrorType());
            System.out.println("Request ID:       " + ase.getRequestId());
        } catch (AmazonClientException ace) {
            System.out.println("Caught an AmazonClientException, which means"+
            		" the client encountered " +
                    "an internal error while trying to " +
                    "communicate with S3, " +
                    "such as not being able to access the network.");
            System.out.println("Error Message: " + ace.getMessage());
        }
    }
	
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
	
	private void deleteLocalFile(String fileName, Path folder){
		System.out.println("Deleting stored file: " + Paths.get(folder.toString(), fileName));
		//Deleting stored file...
		try {
			Path path = Paths.get(folder.toString(), fileName);
		    Files.delete(path);
		    System.out.println("LOCAL DELETION: File " + fileName + " deleted successfully");
		} catch (NoSuchFileException x) {
		    System.err.format("%s: no such" + " file or directory%n", Paths.get(folder.toString(), fileName));
		} catch (DirectoryNotEmptyException x) {
		    System.err.format("%s not empty%n", Paths.get(folder.toString(), fileName));
		} catch (IOException x) {
		    // File permission problems are caught here.
		    System.err.println(x);
		}
	}
	
	private String getFileNameFromURL(String url){
		return (url.substring(url.lastIndexOf('/') + 1));
	}
	//ONLY ON PRODUCTION
	
	private boolean isProductionStage(){
		return this.profileStage.equals("prod");
	}

}
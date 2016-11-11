package com.fullteaching.backend.filegroup;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/files")
public class FileGroupController {
	
	@Autowired
	private FileGroupRepository fileGroupRepository;
	
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
		
		checkAuthorizationUsers(cd, cd.getCourse().getAttenders());
		
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
		
		checkAuthorizationUsers(cd, cd.getCourse().getAttenders());
		
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
	
	
	//Login checking method for the backend
	private ResponseEntity<Object> checkBackendLogged(){
		if (!user.isLoggedUser()) {
			System.out.println("Not user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		return null; 
	}
	
	//Authorization checking for adding new Entries (the user must be an attender)
	private ResponseEntity<Object> checkAuthorizationUsers(Object o, Collection<User> users){
		if(o == null){
			//The object does not exist
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		if(!users.contains(this.user.getLoggedUser())){
			//The user is not authorized to edit if it is not an attender of the Course
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED); 
		}
		return null;
	}

}
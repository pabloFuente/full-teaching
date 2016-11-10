package com.fullteaching.backend.forum;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.UserComponent;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.user.User;

@RestController
@RequestMapping("/forum")
public class ForumController {
	
	@Autowired
	private UserComponent user;
	
	@Autowired
	private CourseDetailsRepository courseDetailsRepository;
	
	@RequestMapping(value = "/edit/{courseDetailsId}", method = RequestMethod.PUT)
	public ResponseEntity<Boolean> modifyForum(@RequestBody boolean activated, @PathVariable(value="courseDetailsId") String courseDetailsId) {
		this.checkBackendLogged();
		
		long id_i = -1;
		try{
			id_i = Long.parseLong(courseDetailsId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		CourseDetails cd = courseDetailsRepository.findOne(id_i);
		
		checkAuthorization(cd, cd.getCourse().getTeacher());
		
		//Modifying the forum
		cd.getForum().setActivated(activated);
		//Saving the modified course
		courseDetailsRepository.save(cd);
		return new ResponseEntity<>(new Boolean(activated), HttpStatus.OK);
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

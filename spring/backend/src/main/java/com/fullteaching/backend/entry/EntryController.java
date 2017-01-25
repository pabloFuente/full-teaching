package com.fullteaching.backend.entry;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.forum.ForumRepository;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/api-entries")
public class EntryController {
	
	@Autowired
	private ForumRepository forumRepository;
	
	@Autowired
	private CourseDetailsRepository courseDetailsRepository;
	
	@Autowired
	private UserComponent user;
	
	@RequestMapping(value = "/forum/{id}", method = RequestMethod.POST)
	public ResponseEntity<Forum> newEntry(@RequestBody Entry entry, @PathVariable(value="id") String courseDetailsId) {
		this.checkBackendLogged();
		
		long id_i = -1;
		try {
			id_i = Long.parseLong(courseDetailsId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		CourseDetails cd = courseDetailsRepository.findOne(id_i);
		
		checkAuthorizationUsers(cd, cd.getCourse().getAttenders());
	
		
		Forum forum = cd.getForum();
		
		//Setting the author of the entry
		User userLogged = user.getLoggedUser();
		entry.setUser(userLogged);
		
		//Setting the author and date of its first comment
		entry.getComments().get(0).setUser(userLogged);
		entry.getComments().get(0).setDate(System.currentTimeMillis());
		
		//Setting the date of the entry
		entry.setDate(System.currentTimeMillis());
		
		forum.getEntries().add(entry);
		/*Saving the modified forum: Cascade relationship between forum and entries
		  will add the new entry to EntryRepository*/
		forumRepository.save(forum);
		/*Entire forum is returned in order to have the new entry ID available just
		in case the author wants to add to it a new comment without refreshing the page*/
		return new ResponseEntity<>(forum, HttpStatus.CREATED);
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

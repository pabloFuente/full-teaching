package com.fullteaching.backend.session;

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
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/sessions")
public class SessionController {
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private SessionRepository sessionRepository;
	
	@Autowired
	private UserComponent user;
	
	@RequestMapping(value = "/course/{id}", method = RequestMethod.POST)
	public ResponseEntity<Course> newSession(@RequestBody Session session, @PathVariable(value="id") String id) {
		this.checkBackendLogged();
		
		long id_i = -1;
		try {
			id_i = Long.parseLong(id);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course course = courseRepository.findOne(id_i);
		
		checkAuthorization(course, course.getTeacher());
		
		//Bi-directional saving
		session.setCourse(course);
		course.getSessions().add(session);
		
		//Saving the modified course: Cascade relationship between course and sessions
		//will add the new session to SessionRepository
		courseRepository.save(course);
		//Entire course is returned
		return new ResponseEntity<>(course, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(value = "/edit", method = RequestMethod.PUT)
	public ResponseEntity<Session> modifySession(@RequestBody Session session) {
		this.checkBackendLogged();
		
		Session s = sessionRepository.findOne(session.getId());
		
		checkAuthorization(s, s.getCourse().getTeacher());
				
		s.setTitle(session.getTitle());
		s.setDescription(session.getDescription());
		s.setDate(session.getDate());
		//Saving the modified session
		sessionRepository.save(s);
		return new ResponseEntity<>(s, HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Session> deleteSession(@PathVariable(value="id") String id) {
		this.checkBackendLogged();
		
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Session session = sessionRepository.findOne(id_i);
		
		checkAuthorization(session, session.getCourse().getTeacher());
		
		Course course = courseRepository.findOne(session.getCourse().getId());
		if (course != null){
			course.getSessions().remove(session);
			sessionRepository.delete(id_i);
			courseRepository.save(course);
			return new ResponseEntity<>(session, HttpStatus.OK);
		}
		else {
			//The Course that owns the deleted session does not exist
			//This code is presumed to be unreachable, because of the Cascade.ALL relationship from Course to Session
			sessionRepository.delete(session);
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
	
	//Authorization checking for adding, editing and deleting sessions (the teacher must own the Course)
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

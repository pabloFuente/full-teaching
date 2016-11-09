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

@RestController
@RequestMapping("/sessions")
public class SessionController {
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private SessionRepository sessionRepository;
	
	@RequestMapping(value = "/course/{id}", method = RequestMethod.POST)
	public ResponseEntity<Course> newSession(@RequestBody Session session, @PathVariable(value="id") String id) {
		long id_i = -1;
		try {
			id_i = Long.parseLong(id);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course course = courseRepository.findOne(id_i);
		if(course != null){
			
			session.setCourse(course);
			
			//Setting the author and date of its first comment
			course.getSessions().add(session);
			
			/*Saving the modified course: Cascade relationship between course and sessions
			  will add the new session to SessionRepository*/
			courseRepository.save(course);
			/*Entire course is returned*/
			return new ResponseEntity<>(course, HttpStatus.CREATED);
		}else{
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}
	
	
	@RequestMapping(value = "/edit", method = RequestMethod.PUT)
	public ResponseEntity<Session> modifySession(@RequestBody Session session) {
		
		Session s = sessionRepository.findOne(session.getId());
		if(s != null){
			
			s.setTitle(session.getTitle());
			s.setDescription(session.getDescription());
			s.setDate(session.getDate());
			
			/*Saving the modified session*/
			sessionRepository.save(s);
			
			return new ResponseEntity<>(s, HttpStatus.OK);
		}else{
			return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
		}
	}
	
	
	@RequestMapping(value = "/delete/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Session> deleteSession(@PathVariable(value="id") String id) {
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Session session = sessionRepository.findOne(id_i);
		if(session != null){
			Course course = courseRepository.findOne(session.getCourse().getId());
			if (course != null){
				course.getSessions().remove(session);
				sessionRepository.delete(id_i);
				courseRepository.save(course);
				return new ResponseEntity<>(session, HttpStatus.OK);
			}
			else {
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
		}
		else{
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
	}
	
}

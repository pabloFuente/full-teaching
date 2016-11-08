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
	
}

package com.fullteaching.backend.course;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.UserComponent;
import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.coursedetails.CourseDetailsRepository;
import com.fasterxml.jackson.annotation.JsonView;
import com.fullteaching.backend.course.Course.SimpleCourseList;
import com.fullteaching.backend.user.User;

@RestController
@RequestMapping("/courses")
public class CourseController {
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private CourseDetailsRepository courseDetailsRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserComponent user;
	
	
	@JsonView(SimpleCourseList.class)
	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public ResponseEntity<Collection<Course>> getCourses(@PathVariable(value="id") String id){
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		Set<Long> s = new HashSet<>();
		s.add(id_i);
		Collection<User> users = userRepository.findAll(s);
		Collection<Course> courses = new HashSet<>();
		courses = courseRepository.findByAttenders(users);
		return new ResponseEntity<>(courses ,HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/course/{id}", method = RequestMethod.GET)
	public ResponseEntity<Course> getCourse(@PathVariable(value="id") String id){
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		Course course = courseRepository.findOne(id_i);
		return new ResponseEntity<>(course ,HttpStatus.OK);
	}
	
	
	@RequestMapping(value = "/new", method = RequestMethod.POST)
	public ResponseEntity<Course> newCourse(@RequestBody Course course) {
		User userLogged = user.getLoggedUser();
		
		//Updating course ('teacher', 'attenders')
		course.setTeacher(userLogged);
		course.getAttenders().add(userLogged);
		
		/*Saving the new course: Course entity is the owner of the relationships
		Course-Teacher, Course-User, Course-CourseDetails. Teacher, User and CourseDetails
		tables don't need to be updated (they will automatically be)*/
		courseRepository.save(course);
		courseRepository.flush();
		
		course = courseRepository.findOne(course.getId());
		return new ResponseEntity<>(course, HttpStatus.CREATED);
	}
	
	
	@RequestMapping(value = "/edit", method = RequestMethod.PUT)
	public ResponseEntity<Course> modifyCourse(@RequestBody Course course) {
		if(courseRepository.findOne(course.getId()) != null){
			courseRepository.save(course);
			return new ResponseEntity<>(course, HttpStatus.OK);
		}else{
			return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
		}
	}
	
	
	@RequestMapping(value = "/delete-{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Course> deleteCourse(@PathVariable(value="id") String id) {
		long id_i = -1;
		try{
			id_i = Long.parseLong(id);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		Course course = courseRepository.findOne(id_i);
		courseRepository.delete(id_i);
		
		//Should userRepository be updated by removing from each user the deleted course?
		//PS: Course is the owner of the ManyToMany bidirectional relationship
		
		return new ResponseEntity<>(course, HttpStatus.OK);
	}
	
	
}

	
	

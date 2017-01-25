package com.fullteaching.backend.course;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.validator.routines.EmailValidator;
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
import com.fasterxml.jackson.annotation.JsonView;
import com.fullteaching.backend.course.Course.SimpleCourseList;
import com.fullteaching.backend.user.User;

@RestController
@RequestMapping("/api-courses")
public class CourseController {
	
	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserComponent user;
	
	private class AddAttendersResponse {
		public Collection<User> attendersAdded;
		public Collection<User> attendersAlreadyAdded;
		public Collection<String> emailsInvalid;
		public Collection<String> emailsValidNotRegistered;
	}
	
	
	@JsonView(SimpleCourseList.class)
	@RequestMapping(value = "/user/{id}", method = RequestMethod.GET)
	public ResponseEntity<Collection<Course>> getCourses(@PathVariable(value="id") String id){
		this.checkBackendLogged();
		
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
		this.checkBackendLogged();
		
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
		this.checkBackendLogged();
		
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
		this.checkBackendLogged();

		Course c = courseRepository.findOne(course.getId());
		
		checkAuthorization(c, c.getTeacher());
		
		//Modifying the course attributes
		c.setImage(course.getImage());
		c.setTitle(course.getTitle());
		if (course.getCourseDetails() != null){
			if (course.getCourseDetails().getInfo() != null){
				c.getCourseDetails().setInfo(course.getCourseDetails().getInfo());
			}
		}
		//Saving the modified course
		courseRepository.save(c);
		return new ResponseEntity<>(c, HttpStatus.OK);
	}
	
	
	
	@RequestMapping(value = "/delete/{courseId}", method = RequestMethod.DELETE)
	public ResponseEntity<Course> deleteCourse(@PathVariable(value="courseId") String courseId) {
		this.checkBackendLogged();
		
		long id_course = -1;
		try{
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Course c = courseRepository.findOne(id_course);
		
		checkAuthorization(c, c.getTeacher());
		
		//Removing the deleted course from its attenders
		Collection<Course> courses = new HashSet<>();
		courses.add(c);
		Collection<User> users = userRepository.findByCourses(courses);
		for(User u: users){
			u.getCourses().remove(c);
		}
		userRepository.save(users);
		c.getAttenders().clear();
		
		
		courseRepository.delete(c);
		return new ResponseEntity<>(c, HttpStatus.OK);
	}
	

	
	@RequestMapping(value = "/edit/add-attenders/course/{courseId}", method = RequestMethod.PUT)
	public ResponseEntity<AddAttendersResponse> addAttenders(
			@RequestBody String[] attenderEmails, 
			@PathVariable(value="courseId") String courseId) 
	{
		
		this.checkBackendLogged();
		
		long id_course = -1;
		try{
			id_course = Long.parseLong(courseId);
		}catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		Course c = courseRepository.findOne(id_course);
		
		checkAuthorization(c, c.getTeacher());
		
		//Strings with a valid email format
		Set<String> attenderEmailsValid = new HashSet<>();
		//Strings with an invalid email format
		Set<String> attenderEmailsInvalid = new HashSet<>();
		//Strings with a valid email format but no registered in the application
		Set<String> attenderEmailsNotRegistered = new HashSet<>();
		
		EmailValidator emailValidator = EmailValidator.getInstance();
		
		for (int i = 0; i < attenderEmails.length; i++){
			if (emailValidator.isValid(attenderEmails[i])) {
				attenderEmailsValid.add(attenderEmails[i]);
			} else {
				attenderEmailsInvalid.add(attenderEmails[i]);
			}
		}
		
		Collection<User> newPossibleAttenders = userRepository.findByNameIn(attenderEmailsValid);
		Collection<User> newAddedAttenders = new HashSet<>();
		Collection<User> alreadyAddedAttenders = new HashSet<>();
		
		for (String s : attenderEmailsValid){
			if (!this.userListContainsEmail(newPossibleAttenders, s)){
				attenderEmailsNotRegistered.add(s);
			}
		}
		
		for (User attender : newPossibleAttenders){
			boolean newAtt = true;
			if (!attender.getCourses().contains(c)) attender.getCourses().add(c); else newAtt = false;
			if (!c.getAttenders().contains(attender)) c.getAttenders().add(attender); else newAtt = false;
			if (newAtt) newAddedAttenders.add(attender); else alreadyAddedAttenders.add(attender);
		}
		
		//Saving the attenders (all of them, just in case a field of the bidirectional relationship is missing in a Course or a User)
		userRepository.save(newPossibleAttenders);	
		//Saving the modified course
		courseRepository.save(c);
		
		AddAttendersResponse customResponse = new AddAttendersResponse();
		customResponse.attendersAdded = newAddedAttenders;
		customResponse.attendersAlreadyAdded = alreadyAddedAttenders;
		customResponse.emailsInvalid = attenderEmailsInvalid;
		customResponse.emailsValidNotRegistered = attenderEmailsNotRegistered;
		
		return new ResponseEntity<>(customResponse, HttpStatus.OK);
	}
	
	
	
	@RequestMapping(value = "/edit/delete-attenders", method = RequestMethod.PUT)
	public ResponseEntity<Set<User>> deleteAttenders(@RequestBody Course course) {
		this.checkBackendLogged();

		Course c = courseRepository.findOne(course.getId());
		
		checkAuthorization(c, c.getTeacher());
		
		Set<Course> setCourse = new HashSet<>();
		setCourse.add(c);
		Collection<User> courseAttenders = userRepository.findByCourses(setCourse);
		
		for (User attender : courseAttenders){
			if (!course.getAttenders().contains(attender)){
				attender.getCourses().remove(c);
			}
		}
		
		userRepository.save(courseAttenders);
		
		//Modifying the course attenders
		c.setAttenders(course.getAttenders());
		//Saving the modified course
		courseRepository.save(c);
		return new ResponseEntity<>(c.getAttenders(), HttpStatus.OK);
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
	
	//Checks if a User collection contains a user with certain email
	private boolean userListContainsEmail(Collection<User> users, String email){
		boolean isContained = false;
		for (User u : users){
			if (u.getName().equals(email)) {
				isContained = true;
				break;
			}
		}
		return isContained;
	}
	
}

	
	

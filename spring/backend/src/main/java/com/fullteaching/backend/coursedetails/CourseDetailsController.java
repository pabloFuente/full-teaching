package com.fullteaching.backend.coursedetails;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.user.UserRepository;

@RestController
@RequestMapping("/coursedetails")
public class CourseDetailsController {
	
	@Autowired
	private CourseDetailsRepository courseDetailsRepository;
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public ResponseEntity<CourseDetails> getCourseDetails(Course c) {
		CourseDetails courseDetails = courseDetailsRepository.findByCourse(c);
		return new ResponseEntity<>(courseDetails ,HttpStatus.OK);
	}
	
}

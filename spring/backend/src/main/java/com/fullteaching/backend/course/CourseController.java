package com.fullteaching.backend.course;


import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.UserRepository;

@RestController
@RequestMapping("/courses")
public class CourseController {
	
	@Autowired
	private CourseRepository goalRepository;
	@Autowired
	private UserRepository userRepository;
	
	
}

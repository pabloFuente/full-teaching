package com.fullteaching.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.user.User;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserRepository userRepository;
	
	//userData: [name, pass, nickName]
	@RequestMapping(value = "/new", method = RequestMethod.POST)
	public ResponseEntity<User> newUser(@RequestBody String[] userData) {
		if(userRepository.findByName(userData[0]) == null) {
			User newUser = new User(userData[0], userData[1], userData[2], "", "ROLE_STUDENT");
			userRepository.save(newUser);
			return new ResponseEntity<>(newUser, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(HttpStatus.IM_USED);
		}
	}

}

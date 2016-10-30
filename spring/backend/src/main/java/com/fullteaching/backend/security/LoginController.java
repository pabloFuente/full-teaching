package com.fullteaching.backend.security;

import java.util.Collection;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;
import com.fullteaching.backend.user.UserRepository;

/**
 * This class is used to provide REST endpoints to logIn and logOut to the
 * service. These endpoints are used by Angular 2 SPA client application.
 * 
 * NOTE: This class is not intended to be modified by app developer.
 */
@RestController
public class LoginController {

	private static final Logger log = LoggerFactory.getLogger(LoginController.class);
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserComponent userComponent;

	@RequestMapping("/logIn")
	public ResponseEntity<User> logIn() {
		
		System.out.println("HERE WE ARE!!!!");

		if (!userComponent.isLoggedUser()) {
			
			System.out.println("NOT LOGGED USER!!!!");
			
			log.info("Not user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		} else {
			
			System.out.println("LOGGED USER!!!!");
			
			User loggedUser = userComponent.getLoggedUser();
			log.info("Logged as " + loggedUser.getName());
			return new ResponseEntity<>(loggedUser, HttpStatus.OK);
		}
	}

	@RequestMapping("/logOut")
	public ResponseEntity<Boolean> logOut(HttpSession session) {
		
		System.out.println("BACK LOG OUT");

		if (!userComponent.isLoggedUser()) {
			log.info("No user logged");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		} else {
			session.invalidate();
			log.info("Logged out");
			return new ResponseEntity<>(true, HttpStatus.OK);
		}
	}

}
package com.fullteaching.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.apache.commons.validator.routines.EmailValidator;

import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.user.User;


@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserRepository userRepository;
	
	//Between 8-20 characters long, at least one uppercase, one lowercase and one number
	private String passRegex = "^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$";
	
	//userData: [name, pass, nickName]
	@RequestMapping(value = "/new", method = RequestMethod.POST)
	public ResponseEntity<User> newUser(@RequestBody String[] userData) {
		
		System.out.println("Signing up a user...");
		
		//If the email is not already in use
		if(userRepository.findByName(userData[0]) == null) {
			
			//If the password has a valid format (at least 8 characters long and contains one uppercase, one lowercase and a number)
			if (userData[1].matches(this.passRegex)){
				
				//If the email has a valid format
				if (EmailValidator.getInstance().isValid(userData[0])){
					System.out.println("Email and password are valid");
					User newUser = new User(userData[0], userData[1], userData[2], "", "ROLE_STUDENT");
					userRepository.save(newUser);
					return new ResponseEntity<>(newUser, HttpStatus.CREATED);
				}
				else{
					System.out.println("Email NOT valid");
					return new ResponseEntity<>(HttpStatus.FORBIDDEN);
				}
			}
			
			else{
				System.out.println("Password NOT valid");
				return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
			}
			
		} else {
			System.out.println("Email already in use");
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
	}

}

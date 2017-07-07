package com.fullteaching.backend.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import org.apache.commons.validator.routines.EmailValidator;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.fullteaching.backend.user.UserRepository;
import com.fullteaching.backend.user.UserComponent;
import com.fullteaching.backend.security.AuthorizationService;
import com.fullteaching.backend.user.User;


@RestController
@RequestMapping("/api-users")
public class UserController {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserComponent user;
	
	@Autowired
	private AuthorizationService authorizationService;
	
    @Value("${recaptcha_private_key}")
    private String recaptchaPrivateKey;
	
	//Between 8-20 characters long, at least one uppercase, one lowercase and one number
	private String passRegex = "^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$";
	
	//userData: [name, pass, nickName, captchaToken]
	@RequestMapping(value = "/new", method = RequestMethod.POST)
	public ResponseEntity<User> newUser(@RequestBody String[] userData) throws Exception {
		
		System.out.println("Signing up a user...");
		
		if(this.validateGoogleCaptcha(userData[3])){
		
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
		else{
			System.out.println("Captcha not validated");
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
	}
	
	
	//userData: [oldPassword, newPassword]
	@RequestMapping(value = "/changePassword", method = RequestMethod.PUT)
	public ResponseEntity<Object> changePassword(@RequestBody String[] userData) {
		
		System.out.println("Changing password...");
		
		ResponseEntity<Object> authorized = authorizationService.checkBackendLogged();
		if (authorized != null){
			return authorized;
		};
		
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		
		//If the stored current password and the given current password match
		if(encoder.matches(userData[0], user.getLoggedUser().getPasswordHash())) {
			
			//If the password has a valid format (at least 8 characters long and contains one uppercase, one lowercase and a number)
			if (userData[1].matches(this.passRegex)){
				System.out.println("Password successfully changed");
				User modifiedUser = userRepository.findByName(user.getLoggedUser().getName());
				modifiedUser.setPasswordHash(encoder.encode(userData[1]));
				userRepository.save(modifiedUser);
				return new ResponseEntity<>(true, HttpStatus.OK);
			}
			else{
				System.out.println("New password NOT valid");
				return new ResponseEntity<>(HttpStatus.NOT_MODIFIED);
			}
		} else {
			System.out.println("Invalid current password");
			return new ResponseEntity<>(HttpStatus.CONFLICT);
		}
	}
	
	private boolean validateGoogleCaptcha(String token) throws Exception{
		String url = "https://www.google.com/recaptcha/api/siteverify";
		URL obj = new URL(url);
		HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

		//Add request header
		con.setRequestMethod("POST");

		String urlParameters  = "secret=" + this.recaptchaPrivateKey + "&response=" + token;

		//Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(urlParameters);
		wr.flush();
		wr.close();

		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'POST' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);

		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();

		//Print result
		System.out.println(response.toString());
		
		JSONParser parser = new JSONParser();
		JSONObject json = (JSONObject) parser.parse(response.toString());
		
		return (boolean) json.get("success");
	}

}

package com.fullteaching.backend;

import java.io.IOException;

import javax.servlet.http.HttpSession;

import org.springframework.test.context.web.WebAppConfiguration;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullteaching.backend.utils.LoginTestUtils;
import com.fullteaching.backend.user.User;

@WebAppConfiguration
public abstract class AbstractLoggedControllerUnitTest extends AbstractControllerUnitTest {

	
	protected HttpSession httpSession; 
	
	protected User loggedUser;
	
	public void setUp() {
		String user_parameters = "[\"fakeemail2@gmail.com\", \"Mock66666\", \"fakeUser\", \"IGNORE\"]";
		
		super.setUp();
		
		try {
			if (httpSession == null) {
			
				loggedUser = LoginTestUtils.registerUserIfNotExists(mvc, user_parameters);
				
				httpSession = LoginTestUtils.logIn(mvc, "fakeemail2@gmail.com", "Mock66666", loggedUser);
				
				if (loggedUser == null)
					loggedUser = (User)httpSession.getAttribute("loggedUser");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}	
	}
		
	
	protected String mapToJson(Object obj) throws JsonProcessingException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.writeValueAsString(obj);
	}
	
	protected <T> T mapFromJson(String json, Class<T> clazz) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(json, clazz);
	}
}

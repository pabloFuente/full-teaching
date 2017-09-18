package com.fullteaching.backend.utils;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Base64;

import javax.servlet.http.HttpSession;

import org.junit.Assert;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullteaching.backend.user.User;

public class LoginTestUtils {

	private static String login_uri = "/api-logIn";
	private static String new_user_uri = "/api-users/new";

	public static HttpSession logIn(MockMvc mvc, String user, String password, User loggedUser) throws UnsupportedEncodingException, Exception {
		
		String userPass = user+":"+password;

		MvcResult result_login = mvc.perform(get(login_uri)
						.header("Authorization", "Basic "+utf8_to_b64(userPass))
						.header("X-Requested-With", "XMLHttpRequest")
					.contentType(MediaType.APPLICATION_JSON_VALUE)
				).andReturn();
		
		System.out.println(result_login.getResponse().toString());
		int status_login = result_login.getResponse().getStatus();
		
		Assert.assertTrue("failure login - expected HTTP status "+
											HttpStatus.OK.value() +
											" but was: "+status_login, 
					status_login==HttpStatus.OK.value());
		if (loggedUser==null) {
			String content = result_login.getResponse().getContentAsString();
			loggedUser = json2User(content);
			result_login.getRequest().getSession().setAttribute("loggedUser", loggedUser);
		}
		return result_login.getRequest().getSession();
	}
	public static HttpSession logIn(MockMvc mvc, String user, String password) throws UnsupportedEncodingException, Exception {
		return logIn(mvc,user,password, null);
	}
	public static User registerUserIfNotExists(MockMvc mvc, String user_parameters) throws Exception {
		
		MvcResult result_insert = mvc.perform(post(new_user_uri)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.content(user_parameters)
				).andReturn();	
		
		int status_insert = result_insert.getResponse().getStatus();
		
		
		if (status_insert == HttpStatus.CREATED.value()) {
			String content = result_insert.getResponse().getContentAsString();
			return json2User(content);
		}
		
		return null;
	}
	
	
	public static String utf8_to_b64(String str) throws UnsupportedEncodingException {
		Base64.Encoder enc= Base64.getEncoder();
        byte[] strenc =enc.encode(str.getBytes("UTF-8"));
        
        return new String(strenc);

	}
	
	public static User json2User(String json) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(json, User.class);
	}
	
}

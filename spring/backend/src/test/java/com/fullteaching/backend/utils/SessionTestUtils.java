package com.fullteaching.backend.utils;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import javax.servlet.http.HttpSession;

import org.junit.Assert;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.session.Session;
import com.google.gson.Gson;

public class SessionTestUtils {
	private static String newSession_uri="/api-sessions/course/";
	
	public static Course newSession(MockMvc mvc, Session s, Course c, HttpSession httpSession) {
		Gson gson = new Gson();
		String request = gson.toJson(s);
		Course course = c;
		//test ok ;
		try {
			MvcResult result =  mvc.perform(post(newSession_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			course = CourseTestUtils.json2Course(content);
			
			int status = result.getResponse().getStatus();	
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);

		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //SessionUtils.newSession");		
		}
	
		return course; 
	}

}

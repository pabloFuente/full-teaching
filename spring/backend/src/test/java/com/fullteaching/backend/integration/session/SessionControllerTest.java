package com.fullteaching.backend.integration.session;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.session.Session;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.fullteaching.backend.utils.SessionTestUtils;
import com.google.gson.Gson;

public class SessionControllerTest extends AbstractLoggedControllerUnitTest {
	
	private static String newSession_uri="/api-sessions/course/";
	private static String editSession_uri="/api-sessions/edit";
	private static String deleteSession_uri="/api-sessions/delete/";
	
	@Before
	public void setUp() {
		super.setUp();
	}

	@Test
	public void newSessionTest() {
		
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "This is the info", false);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

		Long date = System.currentTimeMillis();
		Session s = new Session("Mock Session", "this descriptions", date, c);
		
		Gson gson = new Gson();
		String request = gson.toJson(s);
		//test ok ;
		try {
			MvcResult result =  mvc.perform(post(newSession_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test UNAUTHORIZED 
		try {
			
			MvcResult result =  mvc.perform(post(newSession_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(request)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test UNAUTHORIZED");
		}
		
		//test BAD_REQUEST 
		try {
			
			MvcResult result =  mvc.perform(post(newSession_uri+"not_a_id")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
		
	}

	@Test
	public void modifySessionTest() {
		
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "This is the info", false);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

		Long date = System.currentTimeMillis();
		Session s = new Session("Mock Session", "this descriptions", date, c);
		
		c = SessionTestUtils.newSession(mvc, s, c, httpSession);
		
		Session toChange = (Session)c.getSessions().toArray()[0];
		
		toChange.setDate(System.currentTimeMillis());
		toChange.setTitle("MODIFIED");
		Gson gson = new Gson();
		
		String request = gson.toJson(toChange);
		
		//test ok ;
		try {
			MvcResult result =  mvc.perform(put(editSession_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test UNAUTHORIZED 
		try {
			
			MvcResult result =  mvc.perform(put(editSession_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(request)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test UNAUTHORIZED");
		}
		
		//test BAD_REQUEST 
		try {
			
			MvcResult result =  mvc.perform(put(editSession_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
	}

	@Test
	public void deleteSessionTest() {
		
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "This is the info", false);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

		Long date = System.currentTimeMillis();
		Session s = new Session("Mock Session", "this descriptions", date, c);
		
		c = SessionTestUtils.newSession(mvc, s, c, httpSession);
		
		long sessionId = ((Session)c.getSessions().toArray()[0]).getId();

		
		//test ok ;
		try {
			MvcResult result =  mvc.perform(delete(deleteSession_uri+sessionId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test UNAUTHORIZED 
		try {
			
			MvcResult result =  mvc.perform(delete(deleteSession_uri+sessionId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test UNAUTHORIZED");
		}
		
		//test BAD_REQUEST 
		try {
			
			MvcResult result =  mvc.perform(delete(deleteSession_uri+"not_a_id")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
		//Course ==null hasn't been found...
	}

}

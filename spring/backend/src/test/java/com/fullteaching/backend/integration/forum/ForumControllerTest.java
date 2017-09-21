package com.fullteaching.backend.integration.forum;

import static org.junit.Assert.fail;
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
import com.fullteaching.backend.utils.CourseTestUtils;

public class ForumControllerTest extends AbstractLoggedControllerUnitTest {
	
	private static String toggleForum_uri = "/api-forum/edit/";
	
	@Before
	public void setUp() {
		super.setUp();
	}

	@Test
	public void toggleForumTest() {
		
		Course c = CourseTestUtils.newCourseWithCd("Course Title", loggedUser, null, "this is the info", false);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);

		//test ok 
		try {
			MvcResult result =  mvc.perform(put(toggleForum_uri+c.getCourseDetails().getId())//fakeID
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content("true")
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
			
			MvcResult result =  mvc.perform(put(toggleForum_uri+c.getCourseDetails().getId())//fakeID
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content("true")
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
			
			MvcResult result =  mvc.perform(put(toggleForum_uri+"not_a_id")//fakeID
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

}

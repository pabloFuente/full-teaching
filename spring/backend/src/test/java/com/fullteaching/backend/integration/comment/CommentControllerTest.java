package com.fullteaching.backend.integration.comment;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MvcResult;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.fullteaching.backend.utils.ForumTestUtils;
import com.google.gson.Gson;

public class CommentControllerTest extends AbstractLoggedControllerUnitTest {

	private static String newComment_uri ="/api-comments/entry/{entryId}/forum/";
	
	private static String courseTitle = "Course Title";
	private static String info ="Course information";
	private static boolean forum = true;
	
	
	@Before
	public void setUp() {
		super.setUp();
		
	}

	@Rollback
	@Test
	public void newCommentTest() {
		
	
		Course c = CourseTestUtils.newCourseWithCd(courseTitle, loggedUser, null, info, forum);	
			
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
				
		Comment cm = new Comment("This is the message", System.currentTimeMillis(), loggedUser);
		Entry entry = new Entry("Test Entry",System.currentTimeMillis(),loggedUser);
		entry.getComments().add(cm);	
		
		c = ForumTestUtils.newEntry(mvc, c, entry, httpSession);
		
		long entryId = c.getCourseDetails().getForum().getEntries().get(0).getId();
		long forumId = c.getCourseDetails().getForum().getId();
		
		Comment comment = new Comment();
		comment.setMessage("New Comment");
		
		Gson gson = new Gson();
		String request_OK = gson.toJson(comment);
		
		//test new message
		//test ok 
		try {
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId))+forumId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			Entry e = ForumTestUtils.json2Entry(content);
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			Assert.assertEquals("failure - expected user x" , loggedUser,e.getComments().get(0).getUser());

		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test UNAUTHORIZED 
		try {
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId))+forumId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(request_OK)
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
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId))+"not_a_id")
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
	
	@Rollback
	@Test
	public void replyCommentTest() throws Exception {
		
		Course c = CourseTestUtils.newCourseWithCd(courseTitle, loggedUser, null, info, forum);	
		
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
						
		Comment cm = new Comment("This is the message", System.currentTimeMillis(), loggedUser);
		Entry entry = new Entry("Test Entry",System.currentTimeMillis(),loggedUser);
		entry.getComments().add(cm);		
		c = ForumTestUtils.newEntry(mvc, c, entry, httpSession);
		
		long entryId = c.getCourseDetails().getForum().getEntries().get(0).getId();
		long forumId = c.getCourseDetails().getForum().getId();
		
		Comment parent = c.getCourseDetails().getForum().getEntries().get(0).getComments().get(0);
		Comment comment = new Comment();
		comment.setMessage("New Comment");
		comment.setCommentParent(parent);
		
		Gson gson = new Gson();
		String request_OK = gson.toJson(comment);
		
		//test new message
		//test ok 
		try {
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId))+forumId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			Entry e = ForumTestUtils.json2Entry(content);

			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			Assert.assertEquals("failure - expected user x" , loggedUser, e.getComments().get(0).getReplies().get(0).getUser());
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test UNAUTHORIZED 
		try {
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", String.valueOf(entryId))+forumId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(request_OK)
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
			
			MvcResult result =  mvc.perform(post(newComment_uri.replace("{entryId}", "not_anID")+"not_a_id")
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
}

package com.fullteaching.backend.integration.course;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import java.util.HashSet;
import java.util.Set;

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
import com.fullteaching.backend.utils.LoginTestUtils;
import com.fullteaching.backend.user.User;

public class CourseControllerTest extends AbstractLoggedControllerUnitTest {

	
	private static String getCourses_uri = "/api-courses/user/";
	private static String getCourse_uri = "/api-courses/course/";
	private static String newCourse_uri = "/api-courses/new";
	private static String editCourse_uri = "/api-courses/edit";
	private static String deleteCourse_uri = "/api-courses/delete/";
	private static String addAttenders_uri = "/api-courses/edit/add-attenders/course/";
	private static String deleteAttenders_uri = "/api-courses/edit/delete-attenders";
	
	private static String[][] attendantsStrings = {	{"fakeemail2@gmail.com","Mock66666","fakeUser","IGNORE"},
													{"fakeemail1@gmail.com","Mock66666","fakeUser","IGNORE"}};
	private static String[][] secondAtemptAttendant = {	{"invalidEmail","Mock66666","fakeUser","IGNORE"},
														{"fakeemail2@gmail.com","repeated","fakeUser","IGNORE"},
														{"ok@gmail.com","OKUser1234","fakeUser","IGNORE"}};
	@Before
	public void setUp() {
		super.setUp();
	}

	@Test
	public void getCoursesFromUserTest() {
		//test OK
		try {

			MvcResult result =  mvc.perform(get(getCourses_uri+"741")
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
		
		//test unauthorized
		try {

			MvcResult result =  mvc.perform(get(getCourses_uri+"741")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test unauthorized");
		}
		
		//KO no long id
		try {
			
			MvcResult result =  mvc.perform(get(getCourses_uri+"no_long")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
		
			/*String content = result.getResponse().getContentAsString();
			 * TODO: Assert course */
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //KO no long id");
		}
		
	}

	@Test
	public void getCourseByIdTest() {
		//test OK
				try {
					
					MvcResult result =  mvc.perform(get(getCourse_uri+"741")
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
				//test unauthorized
				try {
					
					MvcResult result =  mvc.perform(get(getCourse_uri+"741")
							                .contentType(MediaType.APPLICATION_JSON_VALUE)
							                ).andReturn();
				
					int status = result.getResponse().getStatus();
					
					int expected = HttpStatus.UNAUTHORIZED.value();
					
					Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
				
				} catch (Exception e) {
					e.printStackTrace();
					fail("EXCEPTION: //KO unauthorized");
				}
				//KO no long id
				try {
					MvcResult result =  mvc.perform(get(getCourse_uri+"no_long")
							                .contentType(MediaType.APPLICATION_JSON_VALUE)
							                .session((MockHttpSession) httpSession)
							                ).andReturn();
				
					int status = result.getResponse().getStatus();
					
					int expected = HttpStatus.BAD_REQUEST.value();

					Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
				
				} catch (Exception e) {
					e.printStackTrace();
					fail("EXCEPTION: //test KO no long id");
				}
	}

	@Test
	public void newCourseTest() {
		
		Course c = CourseTestUtils.newCourseWithCd("Test Course", loggedUser, null, "empty", true);
		Course c2= CourseTestUtils.newCourse("Test Course", loggedUser, null);		
		
		String OK_request =CourseTestUtils.course2JsonStr(c);
		String OK_request_nullcd = CourseTestUtils.course2JsonStr(c2);
		
		
		//test OK
		try {
			MvcResult result =  mvc.perform(post(newCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test OK cd
		try {
			MvcResult result =  mvc.perform(post(newCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request_nullcd)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK cd");
		}
		//test unauthorized
		try {
			MvcResult result =  mvc.perform(post(newCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test unauthorized");
		}
		
		//test bad request
		try {
			MvcResult result =  mvc.perform(post(newCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test  bad request");
		}
		
	}

	//TODO: // If the user is not the teacher of the course
	//TODO: // If courseDetaisl != null
	@Test
	public void modifyCourseTest() {
		
		Course c = CourseTestUtils.newCourse("To Modify", loggedUser, null);
		Course c2 = CourseTestUtils.newCourse("Modified", null, null);
		
		Course cwcd = CourseTestUtils.newCourseWithCd("To Modify", loggedUser, null, "info", false);
		Course cwcd2 = CourseTestUtils.newCourseWithCd("To Modify", loggedUser, null, "Modified", false);

		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession); 
		c2.setId(c.getId());
		
		cwcd = CourseTestUtils.createCourseIfNotExist(mvc, cwcd, httpSession); 
		cwcd2.setId(cwcd.getId());
		
		String OK_request =CourseTestUtils.course2JsonStr(c2);
		String OK_request2 = CourseTestUtils.course2JsonStr(cwcd2);

		try {
			MvcResult result =  mvc.perform(put(editCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request.replaceAll("_ID_", String.valueOf(c.getId())))
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			/*
			 * TODO check more checks to do
			 */
			
			int status = result.getResponse().getStatus();
			int expected = HttpStatus.OK.value();
			
			String content = result.getResponse().getContentAsString();
			Course c_res = CourseTestUtils.json2Course(content);

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			Assert.assertEquals("failure - expected title: "+c2.getTitle(), c2.getTitle(), c_res.getTitle());
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
		try {
			MvcResult result =  mvc.perform(put(editCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request2.replaceAll("_ID_", String.valueOf(c.getId())))
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			/*
			 * TODO check more checks to do
			 */
			
			int status = result.getResponse().getStatus();
			int expected = HttpStatus.OK.value();
			
			String content = result.getResponse().getContentAsString();
			Course c_res = CourseTestUtils.json2Course(content);

			Assert.assertEquals("failure - expected HTTP status (2) "+expected, expected, status);
			Assert.assertEquals("failure - expected title(2): "+cwcd2.getCourseDetails().getInfo(), cwcd2.getCourseDetails().getInfo(), c_res.getCourseDetails().getInfo());
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//test unauthorized
		try {
			MvcResult result =  mvc.perform(put(editCourse_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request.replaceAll("_ID_", String.valueOf(c.getId())))
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test unauthorized");
		}
			
	}

	//TODO: // If the user is not the teacher of the course
	@Test
	public void delteteCourseTest() {
		
		Course c = CourseTestUtils.newCourse("to delete", loggedUser, null);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
		
		//test unauthorized
		try {
			MvcResult result =  mvc.perform(delete(deleteCourse_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test unauthorized");
		}
		
		//test OK request
		try {
			MvcResult result =  mvc.perform(delete(deleteCourse_uri+"not_a_course")
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
		
		try {
				MvcResult result =  mvc.perform(delete(deleteCourse_uri+c.getId())
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
			
	}

	@Test
	public void addAttenders2CourseTest() throws Exception {
		
		//Prepare Test

		String attendersEmails = "[";
		for (int i = 0; i< attendantsStrings.length;i++) {
			attendersEmails += "\""+attendantsStrings[i][0]+"\",";
			LoginTestUtils.registerUserIfNotExists(mvc, "[\""+attendantsStrings[i][0]+"\","
														+"\""+attendantsStrings[i][1]+"\","
														+"\""+attendantsStrings[i][2]+"\","
														+"\""+attendantsStrings[i][3]+"\"]");
		}
		attendersEmails = attendersEmails.substring(0, attendersEmails.length()-1)+"]";
		
		String attenders2Emails = "[";
		for (int i = 0; i< secondAtemptAttendant.length;i++) {
			attenders2Emails += "\""+secondAtemptAttendant[i][0]+"\",";
			LoginTestUtils.registerUserIfNotExists(mvc, "[\""+secondAtemptAttendant[i][0]+"\","
														+"\""+secondAtemptAttendant[i][1]+"\","
														+"\""+secondAtemptAttendant[i][2]+"\","
														+"\""+secondAtemptAttendant[i][3]+"\"]");
		}
		attenders2Emails = attenders2Emails.substring(0, attenders2Emails.length()-1)+"]";
		
		Course c = CourseTestUtils.newCourse("to modify", loggedUser, null);

		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
		
		//test unauthorized
		try {
				MvcResult result =  mvc.perform(put(addAttenders_uri+c.getId())
						                .contentType(MediaType.APPLICATION_JSON_VALUE)
						                .content(attendersEmails)
						                ).andReturn();
				
				int status = result.getResponse().getStatus();
				
				int expected = HttpStatus.UNAUTHORIZED.value();

				Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
			} catch (Exception e) {
				e.printStackTrace();
				fail("EXCEPTION: //test UNAUTHORIZED");
			}
		//test bad request
		try {
			MvcResult result =  mvc.perform(put(addAttenders_uri+"not_a_course")
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
		
		//test ok 1
		try {
			MvcResult result =  mvc.perform(put(addAttenders_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(attendersEmails)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
		//test ok 2
		try {
			MvcResult result =  mvc.perform(put(addAttenders_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(attenders2Emails)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();
			
			Assert.assertEquals("failure - expected HTTP status (2) "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
	}

	@Test
	public void deleteAttenderFromCourseTest() throws Exception {
		
		Course c = CourseTestUtils.newCourse("to modify", loggedUser, null);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
		c = CourseTestUtils.addAttenders(mvc,httpSession,c,attendantsStrings);
		
		Set<User> cattenders = new HashSet<User>();
		cattenders.add((User)c.getAttenders().toArray()[0]);
		
		Course ccopia = CourseTestUtils.newCourse(c.getTitle(), loggedUser, cattenders);
		ccopia.setId(c.getId());
				
		String ok_request =  CourseTestUtils.course2JsonStr(ccopia);
		
		//test unauthorized
		try {
				MvcResult result =  mvc.perform(put(deleteAttenders_uri)
						                .contentType(MediaType.APPLICATION_JSON_VALUE)
						                .content(ok_request)
						                ).andReturn();
				
				int status = result.getResponse().getStatus();
				
				int expected = HttpStatus.UNAUTHORIZED.value();

				Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
			} catch (Exception e) {
				e.printStackTrace();
				fail("EXCEPTION: //test UNAUTHORIZED");
			}
		//test bad request
		try {
			MvcResult result =  mvc.perform(put(deleteAttenders_uri)
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
		
		//test ok 
		try {
			MvcResult result =  mvc.perform(put(deleteAttenders_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(ok_request)
					                ).andReturn();
			
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();

			Assert.assertEquals("failure - expected HTTP status  "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
	}

}

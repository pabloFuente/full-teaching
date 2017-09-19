/**
 * 
 */
package com.fullteaching.backend.integration.user;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import javax.servlet.http.HttpSession;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import com.fullteaching.backend.AbstractControllerUnitTest;
import com.fullteaching.backend.utils.LoginTestUtils;

/**
 * @author gtunon
 *
 */
/*@Transactional After each test the BBDD is rolled back*/
@Transactional
public class UserControllerTest extends AbstractControllerUnitTest {
		
	//urls
	static String new_user_uri = "/api-users/new";
	static String change_password_uri = "/api-users/changePassword";
	static String login_uri = "/api-logIn";
	
	//userStrings
	static String ok_parameters = "[\"unique@gmail.com\", \"Mock66666\", \"fakeUser\", \"IGNORE\"]";
	static String ko_parameters1 = "[\"unique@gmail.com\", \"Mock66666\", \"repeatedUser\", \"IGNORE\"]";
	static String ko_parameters2 = "[\"unique_unique@gmail.com\", \"Mock\", \"InvalidPassword\", \"IGNORE\"]";
	static String ko_parameters3 = "[\"nonvalidMAIL\", \"Mock66666\", \"fakeUser\", \"IGNORE\"]";
	
	//passParameters
	static String pass_parameters = "[\"Mock66666\", \"Mock77777\"]";
	static String bad1_parameters = "[\"Mock66666\", \"Mock77777\"]";
	static String bad2_parameters = "[\"Mock77777\", \"notvalid\"]";
	
	//roles
	String[] roles = {"STUDENT"};

	@Before
	public void setUp() {
		super.setUp();
	}
	
	/**
	 * Test method for {@link com.fullteaching.backend.user.UserController#newUser(java.lang.String[])}.
	 */
	@Test
	public void controllerNewUserTest() {

		/*Test OK*/
		try {
			MvcResult result =  mvc.perform(post(new_user_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(ok_parameters)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - OK");
		}
		
		/*Test repeated user*/
		try {
			MvcResult result =  mvc.perform(post(new_user_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(ko_parameters1)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CONFLICT.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - repeated user");

		}
		
		/*Test bad password*/
		try {
			MvcResult result =  mvc.perform(post(new_user_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(ko_parameters2)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
				
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - badPassword");

		}	
		
		/*Test bad email*/
		try {
			MvcResult result =  mvc.perform(post(new_user_uri)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(ko_parameters3)
					                ).andReturn();
		
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.FORBIDDEN.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - badEmail");

		}
	}

	/**
	 * Test method for {@link com.fullteaching.backend.user.UserController#changePassword(java.lang.String[])}.
	 * @throws Exception 
	 */
	@Test
	public void userChangePasswordTest() throws Exception {
	
			/*Create new user*/
			LoginTestUtils.registerUserIfNotExists(mvc, ok_parameters);
			
			/*Login user*/
			HttpSession session = LoginTestUtils.logIn(mvc, "unique@gmail.com", "Mock66666");
			
			try {
			/*Test change password OK*/
			MvcResult result_pass = mvc.perform(put(change_password_uri)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.content(pass_parameters)
					.session((MockHttpSession) session)
				).andReturn();
			
			int status_pass = result_pass.getResponse().getStatus();
			Assert.assertTrue("failure login - expected HTTP status "+
													HttpStatus.OK.value() +
													" but was: "+status_pass, 
								status_pass==HttpStatus.OK.value());
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - OK");

		}
		try {
			/*Test change password bad initial password*/
			MvcResult result_bad1 = mvc.perform(put(change_password_uri)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.content(bad1_parameters)
					.session((MockHttpSession) session)
				).andReturn();
			
			int status_bad1 = result_bad1.getResponse().getStatus();
			Assert.assertTrue("failure login - expected HTTP status "+
													HttpStatus.CONFLICT.value() +
													" but was: "+status_bad1, 
										status_bad1==HttpStatus.CONFLICT.value());
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - OK");

		}
		try {	
			/*Test change password bad initial password*/
			MvcResult result_bad2 = mvc.perform(put(change_password_uri)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.content(bad2_parameters)
					.session((MockHttpSession) session)
				).andReturn();
			
			int status_bad2 = result_bad2.getResponse().getStatus();
			Assert.assertTrue("failure login - expected HTTP status "+
													HttpStatus.NOT_MODIFIED.value() +
													" but was: "+status_bad2, 
										status_bad2==HttpStatus.NOT_MODIFIED.value());
		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception: newUserTest - OK");
		}
	
	}
	
	

}

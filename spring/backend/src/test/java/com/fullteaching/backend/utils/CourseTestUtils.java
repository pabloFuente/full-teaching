package com.fullteaching.backend.utils;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.user.User;
import com.google.gson.Gson;

public class CourseTestUtils {
	
	private static String newCourse_uri = "/api-courses/new";
	private static String addAttenders_uri = "/api-courses/edit/add-attenders/course/";


	public static Course createCourseIfNotExist(MockMvc mvc, Course c, HttpSession httpSession) {
		String OK_request ="{\"title\":\"TEST COURSE\"," +
				"\"teacher\":null, "+
				"\"image\":\"/../assets/images/default_session_image.png\","+
				"\"courseDetails\":{\"info\":\"\","+
				 					"\"forum\":{\"activated\":true," +
				 								"\"entries\":[]}," +
				 					 "\"files\":[]}," + 
				"\"sessions\":[]," + 
				"\"attenders\":[]}" ;

		try {
			OK_request = course2JsonStr(c);
		}
		
		catch(NullPointerException e) {
			//nothing to do
		}
		//test OK
		try {
			//there is no courses so how to mock that?
			MvcResult result =  mvc.perform(post(newCourse_uri)//fakeID
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .content(OK_request)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			return json2Course(content);
				
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}


	public static Course addAttenders(MockMvc mvc, HttpSession httpSession, Course c, String[][] attendantsStrings) throws Exception {
		
		String attendersEmails = "[";
		for (int i = 0; i< attendantsStrings.length;i++) {
			attendersEmails += "\""+attendantsStrings[i][0]+"\",";
			LoginTestUtils.registerUserIfNotExists(mvc, "[\""+attendantsStrings[i][0]+"\","
														+"\""+attendantsStrings[i][1]+"\","
														+"\""+attendantsStrings[i][2]+"\","
														+"\""+attendantsStrings[i][3]+"\"]");
		}
		attendersEmails = attendersEmails.substring(0, attendersEmails.length()-1)+"]";

		try {
			//there is no courses so how to mock that?
			MvcResult result =  mvc.perform(put(addAttenders_uri+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(attendersEmails)
					                ).andReturn();
			
			String content = result.getResponse().getContentAsString();
			JSONObject  json = new JSONObject(content);		
			int status = result.getResponse().getStatus();	
			ObjectMapper mapper = new ObjectMapper();
			Set<User> users = new HashSet<User>();
			JSONArray aux = (JSONArray) json.get("attendersAdded");
			for(int i=0; i < aux.length(); i++) {
				JSONObject o = aux.getJSONObject(i);
				users.add(mapper.readValue(o.toString(), User.class));
			}
			aux = (JSONArray) json.get("attendersAlreadyAdded");
			for(int i=0; i < aux.length(); i++) {
				JSONObject o = aux.getJSONObject(i);
				users.add(mapper.readValue(o.toString(), User.class));
			}
			c.setAttenders(users);
			int expected = HttpStatus.OK.value();
			//http status 200 created!
			Assert.assertEquals("failure CourseUtils.addAttenders  - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
		}
		
		return c;
	}
	
	
	public static String course2JsonStr(Course c) throws NullPointerException {
		if(c!=null) {
			Gson gson = new Gson();
			return gson.toJson(c);
		}
		else {
			throw new NullPointerException("Course is Null");
		}
	}
	
	
	public static Course json2Course(String json) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(json, Course.class);
	}
	
	public static CourseDetails json2CourseDetails(String json) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		json = json.replaceAll("\"" + "fileExtension" + "\"[ ]*:[^,}\\]]*[,]?", "");
		json = json.replaceAll(",}","}");
		return mapper.readValue(json, CourseDetails.class);
	}


	public static Course newCourse (String courseTitle, User loggedUser, Set<User> attendants) {
		Course c = new Course(courseTitle, "/../assets/images/default_session_image.png", loggedUser);
		
		if(attendants != null) c.setAttenders(attendants);
		
		return c;
	}
	
	public static Course newCourseWithCd(String courseTitle, User loggedUser, Set<User> attendants, String info,
			boolean forum) {
		
		Course c = newCourse(courseTitle, loggedUser, attendants);
		CourseDetails cd = new CourseDetails();
		
		if(info != null) cd.setInfo(info);
		cd.getForum().setActivated(forum);
		
		c.setCourseDetails(cd);	
		
		return c;
	}
	
	
}

package com.fullteaching.backend.utils;

import static org.junit.Assert.fail;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.filegroup.FileGroup;
import com.google.gson.Gson;

public class FileTestUtils {
	
	private static String newFile_uri="/api-files/";//{courseDetails_id}
	private static String upload_uri="/api-load-files/upload/course/{courseId}/file-group/";//{fileGroupId}
	
	private static MockMultipartFile firstFile = new MockMultipartFile("data", "filename.txt", "text/plain", "some xml".getBytes());
	private static MockMultipartFile secondFile = new MockMultipartFile("data", "other.txt", "text/plain", "some other xml".getBytes());

	public static FileGroup newFileGroup(MockMvc mvc, HttpSession httpSession, FileGroup fg, Course c) {
		
		long courseId = c.getCourseDetails().getId();
		String request_OK = fileGroup2Json(fg);
		
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();		

			String content = result.getResponse().getContentAsString();
			CourseDetails cd = CourseTestUtils.json2CourseDetails(content);
			
			return getFileGroupFromCd(cd, fg.getTitle());
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //FileTestUtils.newFileGroup ::"+e.getClass().getName());
		}
		
		return null;
	}
	
	public static FileGroup uploadTestFile(MockMvc mvc, HttpSession httpSession, FileGroup fg, Course c, MockMultipartFile file) {
		
		try {
			MvcResult result =  mvc.perform(MockMvcRequestBuilders.fileUpload(upload_uri.replace("{courseId}",""+c.getId())+fg.getId())
	                .file(file)
	                .session((MockHttpSession) httpSession)
	                ).andReturn();
	
			String content = result.getResponse().getContentAsString();
			System.out.println(content);
			return json2FileGroup(content);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //FileTestUtils.uploadTestFile ::"+e.getClass().getName());
		}
		return null;
	}

	public static FileGroup uploadTestFile(MockMvc mvc, HttpSession httpSession, FileGroup fg, Course c) {
		return uploadTestFile(mvc,httpSession,fg,c,firstFile);
	}
	
	public static FileGroup uploadOtherTestFile(MockMvc mvc, HttpSession httpSession, FileGroup fg, Course c) {
		return uploadTestFile(mvc,httpSession,fg,c,secondFile);
	}
	
	public static FileGroup json2FileGroup(String json) throws JsonParseException, JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		json = json.replaceAll("\"" + "fileExtension" + "\"[ ]*:[^,}\\]]*[,]?", "");
		json = json.replaceAll(",}","}");
		return mapper.readValue(json, FileGroup.class);
	}
	
	
	public static String fileGroup2Json(FileGroup fg) {
		if(fg!=null) {
			Gson gson = new Gson();
			return gson.toJson(fg);
		}
		else {
			throw new NullPointerException("FileGroup is Null");
		}
	}
	
	public static String file2Json(File f) {
		if(f!=null) {
			Gson gson = new Gson();
			return gson.toJson(f);
		}
		else {
			throw new NullPointerException("file is Null");
		}
	}
	
	public static FileGroup getFileGroupFromCd(CourseDetails cd, String name) {
		List<FileGroup> list = cd.getFiles();
		return getFileGroupByName(list,name);
		
	}
	
	public static List<FileGroup> json2fileGroupList(String json) throws JsonParseException, JsonMappingException, IOException{
		json = json.replaceAll("\"" + "fileExtension" + "\"[ ]*:[^,}\\]]*[,]?", "");
		json = json.replaceAll(",}","}");
		
		List<FileGroup> fglst = new ArrayList<FileGroup>();
		
		JSONArray jsonarray = new JSONArray(json);
		
		for (int i = 0; i < jsonarray.length(); i++) {
		    JSONObject jsonobject = jsonarray.getJSONObject(i);
		    fglst.add(json2FileGroup(jsonobject.toString()));
		}
		
		return fglst;
		
	}
	
	private static FileGroup getFileGroupByName(List<FileGroup> list, String name) {
		
		for (FileGroup ele : list) {
			if (name.equals(ele.getTitle()))
				return ele;
			if (ele.getFileGroups()!=null && ele.getFileGroups().size()>0)
				return getFileGroupByName(ele.getFileGroups(), name);
		}
		
		return null;
	}
	
	
}

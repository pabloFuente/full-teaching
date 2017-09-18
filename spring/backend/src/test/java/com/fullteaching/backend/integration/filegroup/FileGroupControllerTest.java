package com.fullteaching.backend.integration.filegroup;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MvcResult;

import com.fullteaching.backend.AbstractLoggedControllerUnitTest;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.file.File;
import com.fullteaching.backend.filegroup.FileGroup;
import com.fullteaching.backend.utils.CourseTestUtils;
import com.fullteaching.backend.utils.FileTestUtils;

public class FileGroupControllerTest extends AbstractLoggedControllerUnitTest {

	private static String newFile_uri="/api-files/";//{courseDetails_id}
	private static String modifyGroupFile_uri="/api-files/edit/file-group/course/";//{courseId}
	private static String editOrder_uri="/api-files/edit/file-order/course/{courseId}/file/{fileId}/from/{sourceID}/to/{targetId}/pos/";//newPosition
	private static String modifyFile_uri="/api-files/edit/file/file-group/{fileGroupId}/course/";//{courseId}
	private static String deleteGroup_uri="/api-files/delete/file-group/{fileGroupId}/course/";//{courseId}
	private static String deleteFile_uri="/api-files/delete/file/{fileId}/file-group/{fileGroupId}/course/";//{courseId}

	@Before
	public void setUp() {
		super.setUp();
	}

	@Test
	public void testNewFileGroup() {
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
		
		CourseDetails cd = null; 
		
		FileGroup fg = new FileGroup("New FileGroup");
		String request_OK = FileTestUtils.fileGroup2Json(fg);
		
		long courseId = c.getCourseDetails().getId();
		
		
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();

			String content = result.getResponse().getContentAsString();
			cd = CourseTestUtils.json2CourseDetails(content);
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
		//Unauthorized
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+courseId)
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
		

		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+"notANumber")
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
		
		
		//Test for filegroups with parent
		fg = FileTestUtils.getFileGroupFromCd(cd, fg.getTitle());
		FileGroup fg2 = new FileGroup("New FileGroup with parent", fg);
		String request_withParent = FileTestUtils.fileGroup2Json(fg2);
		
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_withParent)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.CREATED.value();
		
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK with Parent");
		}
		
		//fake parent
		fg.setId(5654);
		FileGroup fg3 = new FileGroup("New FileGroup with parent", fg);
		String request_withParent_BadRequest = FileTestUtils.fileGroup2Json(fg3);
		
		try {

			MvcResult result =  mvc.perform(post(newFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_withParent_BadRequest)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();
		
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK with Parent");
		}
		
	}

	@Test
	public void testModifyFileGroup() {
		//Prepare Test
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
		
		CourseDetails cd = null; 
		
		FileGroup fg = new FileGroup("New FileGroup");
		fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);
		long courseId = c.getId();
		
		fg.setTitle("Modified FileGroup");
		
		String request_OK = FileTestUtils.fileGroup2Json(fg);
		try {

			MvcResult result =  mvc.perform(put(modifyGroupFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();

			FileGroup fg1 = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			Assert.assertEquals("not modified", "Modified FileGroup", fg1.getTitle());
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
		//Unauthorized
		try {

			MvcResult result =  mvc.perform(put(modifyGroupFile_uri+courseId)
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
		

		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(put(modifyGroupFile_uri+"not_A_Number")
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
		
		//NOT_MODIFIED
		fg.setId(4564564); //fake id
		String request_KO = FileTestUtils.fileGroup2Json(fg);
		try {

			MvcResult result =  mvc.perform(put(modifyGroupFile_uri+courseId)
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_KO)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.NOT_MODIFIED.value();

			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test NOT_MODIFIED");
		}
		
		
		
	}
	
	@Test
	public void testEditFileOrder() {
		///api-files/edit/file-order/course/{courseId}/file/{fileId}/from/{sourceID}/to/{targetId}/pos/";//newPosition
		
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
				
		FileGroup fg = new FileGroup("New FileGroup");
		fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);
		fg = FileTestUtils.uploadTestFile(mvc, httpSession, fg, c);
		long firstFileId = fg.getFiles().get(0).getId();
		fg = FileTestUtils.uploadOtherTestFile(mvc, httpSession, fg, c);
		long secondFileId = fg.getFiles().get(1).getId();

		FileGroup fg2 = new FileGroup("Other FileGroup");
		fg2 = FileTestUtils.newFileGroup(mvc, httpSession, fg2, c);
		fg2 = FileTestUtils.uploadOtherTestFile(mvc, httpSession, fg2, c);
		
		try {

			MvcResult result =  mvc.perform(put(editOrder_uri.replace("{courseId}", ""+c.getId())
															 .replace("{fileId}", ""+firstFileId)
															 .replace("{sourceID}", ""+fg.getId())
															 .replace("{targetId}", ""+fg2.getId())+ "0")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();

			List<FileGroup> fglst = FileTestUtils.json2fileGroupList(result.getResponse().getContentAsString());
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
			/*check the filegroups*/
			Assert.assertEquals("failure - not moved", 1, fglst.get(0).getFiles().size());
			Assert.assertEquals("failure - not moved", 2, fglst.get(1).getFiles().size());
			
			Assert.assertEquals("failure - order fail" , 0, fglst.get(0).getFiles().get(0).getIndexOrder());
			Assert.assertEquals("failure - order fail" , 0, fglst.get(1).getFiles().get(0).getIndexOrder());
			Assert.assertEquals("failure - order fail" , 1, fglst.get(1).getFiles().get(1).getIndexOrder());

			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		
		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(put(editOrder_uri.replace("{courseId}", "not_a_long")
															 .replace("{fileId}", ""+firstFileId)
															 .replace("{sourceID}", ""+fg.getId())
															 .replace("{targetId}", ""+fg2.getId())+ "0")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();

			//FileGroup fg1 = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
		
		//UNAUTHORIZED
		try {

			MvcResult result =  mvc.perform(put(editOrder_uri.replace("{courseId}", ""+c.getId())
															 .replace("{fileId}", ""+firstFileId)
															 .replace("{sourceID}", ""+fg.getId())
															 .replace("{targetId}", ""+fg2.getId())+ "0")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			
			
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
	}
	

	@Test
	public void testModifyFile() {
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
				
		FileGroup fg = new FileGroup("New FileGroup");
		fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);
		
		File f_not_existing = new File(1,"no Exists");
		String not_modified = FileTestUtils.file2Json(f_not_existing);
		
		//NOT_MODIFIED 1
		try {

			MvcResult result =  mvc.perform(put(modifyFile_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(not_modified)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.NOT_MODIFIED.value();
	
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test NOT_MODIFIED 1");
		}
		
		//NOT_MODIFIED 2
		try {

			MvcResult result =  mvc.perform(put(modifyFile_uri.replace("{fileGroupId}", "564")+c.getId())//notExisting fileGroup
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(not_modified)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.NOT_MODIFIED.value();
	
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
		
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test NOT_MODIFIED 2");
		}
				
		//OK preparation
		fg = FileTestUtils.uploadTestFile(mvc, httpSession, fg, c);
		
		File f = fg.getFiles().get(0);
		f.setName("Modified File");
		
		String request_OK = FileTestUtils.file2Json(f);
		try {

			MvcResult result =  mvc.perform(put(modifyFile_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                .content(request_OK)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.OK.value();

			FileGroup fg_r = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
			/*check the filename*/
			Assert.assertEquals("failure - not modified", "Modified File", fg_r.getFiles().get(0).getName());
		
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test OK");
		}
		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(put(modifyFile_uri.replace("{fileGroupId}", ""+fg.getId())+"not_a_long")
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();

			//FileGroup fg1 = FileTestUtils.json2FileGroup(result.getResponse().getContentAsString());
			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST");
		}
		
		//UNAUTHORIZED
		try {

			MvcResult result =  mvc.perform(put(modifyFile_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
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
	}
	
	
	@Test
	public void testDeleteFileGroup() {
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
				
		FileGroup fg = new FileGroup("New FileGroup");
		fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);
		
		//OK
		try {

			MvcResult result =  mvc.perform(delete(deleteGroup_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
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
		
		//Bad Request
		try {

			MvcResult result =  mvc.perform(delete(deleteGroup_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
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
		
		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(delete(deleteGroup_uri.replace("{fileGroupId}", ""+fg.getId())+"not_a_long")
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

			MvcResult result =  mvc.perform(delete(deleteGroup_uri.replace("{fileGroupId}", ""+fg.getId())+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
					
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test UNAUTHORIZED");
		}
		
	}
	
	@Test
	public void testDeleteFile() {
		//private static String deleteFile_uri="/api-files/delete/file/{fileId}/file-group/{fileGroupId}/course/";//{courseId}
		Course c = CourseTestUtils.newCourseWithCd("Course", loggedUser, null, "this is the info", true);
		c = CourseTestUtils.createCourseIfNotExist(mvc, c, httpSession);
				
		FileGroup fg = new FileGroup("New FileGroup");
		fg = FileTestUtils.newFileGroup(mvc, httpSession, fg, c);
		
		fg = FileTestUtils.uploadTestFile(mvc, httpSession, fg, c);
		long firstFileId = fg.getFiles().get(0).getId();
		
		
		//OK
		try {

			MvcResult result =  mvc.perform(delete(deleteFile_uri.replace("{fileGroupId}", ""+fg.getId())
																 .replace("{fileId}", ""+firstFileId)+c.getId())
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
		
		//Bad Request (already deleted)
		/*try {

			MvcResult result =  mvc.perform(delete(deleteFile_uri.replace("{fileGroupId}", ""+fg.getId())
				 					 .replace("{fileId}", ""+firstFileId)+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                .session((MockHttpSession) httpSession)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.BAD_REQUEST.value();

			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
					
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test BAD_REQUEST already deleted");
		}*/
		
		//BAD_REQUEST
		try {

			MvcResult result =  mvc.perform(delete(deleteFile_uri.replace("{fileGroupId}", ""+fg.getId())
					 											 .replace("{fileId}", ""+firstFileId)+"not_a_long")
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

			MvcResult result =  mvc.perform(delete(deleteFile_uri.replace("{fileGroupId}", ""+fg.getId())
					 											 .replace("{fileId}", ""+firstFileId)+c.getId())
					                .contentType(MediaType.APPLICATION_JSON_VALUE)
					                ).andReturn();
	
			int status = result.getResponse().getStatus();
			
			int expected = HttpStatus.UNAUTHORIZED.value();

			
			Assert.assertEquals("failure - expected HTTP status "+expected, expected, status);
					
			
		} catch (Exception e) {
			e.printStackTrace();
			fail("EXCEPTION: //test UNAUTHORIZED");
		}
		
	}

}

package com.fullteaching.backend.unitary.coursedetails;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.filegroup.FileGroup;
import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.user.User;

public class CourseDetailsUnitaryTests extends AbstractUnitTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void newCourseDetailsTest() {
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);

		CourseDetails cd = new CourseDetails();
		Assert.notNull(cd);
		
		Course c = new Course("to modify", "/../assets/images/default_session_image.png", u);

		CourseDetails cd2 = new CourseDetails(c);
		
		Assert.notNull(cd2);
		Assert.isTrue(cd2.getCourse().equals(c));
		
	}

	@Test
	public void setAndGetCourseDetailsInfoTest() {
		CourseDetails cd = new CourseDetails();
		cd.setInfo("this is info");
		Assert.notNull(cd);
		Assert.isTrue("this is info".equals(cd.getInfo()));
	}

	@Test
	public void setAndGetCourseDetailsForumTest() {
		CourseDetails cd = new CourseDetails();
		Forum forum = new Forum();
		cd.setForum(forum);
		Assert.notNull(cd);
		Assert.isTrue(forum.equals(cd.getForum()));
	}

	@Test
	public void setAndGetCourseDetailsFilesTest() {
		CourseDetails cd = new CourseDetails();
		List<FileGroup> files= new ArrayList<FileGroup>();
		cd.setFiles(files);
		Assert.notNull(cd);
		Assert.isTrue(files.equals(cd.getFiles()));
	}

	@Test
	public void SetAndGetCourseDetailsCourseTest() {
		CourseDetails cd = new CourseDetails();
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);

		Course c = new Course("to modify", "/../assets/images/default_session_image.png", u);

		cd.setCourse(c);
		Assert.notNull(cd);
		Assert.isTrue(cd.getCourse().equals(c));

	}

}

package com.fullteaching.backend.unitary.course;

import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.coursedetails.CourseDetails;
import com.fullteaching.backend.user.User;

public class CourseUnitaryTest extends AbstractUnitTest {

	private static String title = "CURSO de Prueba";
	private static String image = "Mock_image";
	private static User teacher;
	
	
	@BeforeClass
	public static void initialize() {
		String [] roles = {"ROLE_TEACHER"};
		teacher = new User("mock_teacher","mock2222","t_mocky", null,roles);
	}

	@Test
	public void newCourseTest() {
		Course c2 = new Course();
		Assert.notNull(c2);
		
		Course c = new Course(title, image, teacher);
		Assert.notNull(c);
		Assert.isTrue(c.getTeacher().equals(teacher));
		Assert.isTrue(c.getImage().equals(image));
		Assert.isTrue(c.getTitle().equals(title));
		Assert.notNull(c.getSessions());
		Assert.notNull(c.getAttenders());
		Assert.isNull(c.getCourseDetails());
		
		CourseDetails cd = new CourseDetails();
		
		Course c3 = new Course(title, image, teacher, cd);
		Assert.notNull(c3);
		Assert.isTrue(c3.getTeacher().equals(teacher));
		Assert.isTrue(c3.getImage().equals(image));
		Assert.isTrue(c3.getTitle().equals(title));
		Assert.notNull(c3.getSessions());
		Assert.notNull(c3.getAttenders());
		Assert.notNull(c3.getCourseDetails());
		
		Assert.isTrue(c3.getCourseDetails().equals(cd));
	}


	@Test
	public void setAndGetCourseTitleTest() {
		Course c = new Course();
		c.setTitle(title);
		Assert.isTrue(c.getTitle().equals(title));
	}

	@Test
	public void setAndGetCourseImageTest() {
		Course c = new Course();
		c.setImage(image);
		Assert.isTrue(c.getImage().equals(image));
	}

	@Test
	public void setAndGetCourseTeacherTest() {
		Course c = new Course();
		c.setTeacher(teacher);
		Assert.isTrue(c.getTeacher().equals(teacher));
	}

	@Test
	public void setAndGetCourseDetailsTest() {
		Course c = new Course();
		c.setCourseDetails(new CourseDetails());
		Assert.notNull(c.getCourseDetails());
	}

	@Test
	public void equalCourseTest() {
		CourseDetails cd = new CourseDetails();
		
		Course c1 = new Course(title, image, teacher, cd);
		c1.setId((long) Math.floor((Math.random()*Long.MAX_VALUE )));
		Course c2 = new Course(title, image, teacher);
		c1.setId((long) Math.floor((Math.random()*Long.MAX_VALUE)));
		
		Assert.isTrue(c1.equals(c1));
		Assert.isTrue(!c1.equals("not_a_course"));
		Assert.isTrue(!c1.equals(c2));
		Assert.isTrue(!c1.equals(null));
		
	}

}

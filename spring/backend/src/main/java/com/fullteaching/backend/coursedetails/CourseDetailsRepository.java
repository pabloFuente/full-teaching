package com.fullteaching.backend.coursedetails;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.user.User;

public interface CourseDetailsRepository extends JpaRepository<CourseDetails, Long> {
	
	CourseDetails findByCourse(Course course);

}

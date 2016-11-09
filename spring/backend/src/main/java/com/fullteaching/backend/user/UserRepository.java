package com.fullteaching.backend.user;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fullteaching.backend.course.Course;

public interface UserRepository extends JpaRepository<User, Long>{
	
	User findByName(String name);
	
	public Collection<User> findByCourses(Collection<Course> courses);

}

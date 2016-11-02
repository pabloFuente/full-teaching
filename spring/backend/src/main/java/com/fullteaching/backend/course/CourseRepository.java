package com.fullteaching.backend.course;

import java.util.Collection;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fullteaching.backend.user.User;

public interface CourseRepository extends JpaRepository<Course, Long> {
	
    public Collection<Course> findByAttenders(Collection<User> users);

}

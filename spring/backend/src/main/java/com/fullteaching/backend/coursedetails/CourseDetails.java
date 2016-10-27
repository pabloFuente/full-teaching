package com.fullteaching.backend.coursedetails;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fullteaching.backend.session.Session;
import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.filegroup.FileGroup;

@Entity
public class CourseDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private List<Session> sessions;
	
	private Forum forum;
	
	private List<FileGroup> files;
	
	@OneToOne(mappedBy="courseDetails")
	private Course course;
	
	public CourseDetails() {
		this.forum = new Forum();
		this.files =  new ArrayList<>();
		this.sessions = new ArrayList<>();
	}

	public CourseDetails(Course course) {
		this.course = course;
		this.forum = new Forum();
		this.files =  new ArrayList<>();
		this.sessions = new ArrayList<>();
	}

	public List<Session> getSessions() {
		return sessions;
	}

	public void setSessions(List<Session> sessions) {
		this.sessions = sessions;
	}

	public Forum getForum() {
		return forum;
	}

	public void setForum(Forum forum) {
		this.forum = forum;
	}

	public List<FileGroup> getFiles() {
		return files;
	}

	public void setFiles(List<FileGroup> files) {
		this.files = files;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}
	
}

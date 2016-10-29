package com.fullteaching.backend.coursedetails;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;

import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.course.Course;
import com.fullteaching.backend.filegroup.FileGroup;

@Entity
public class CourseDetails {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	@OneToOne(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	private Forum forum;
	
	@OneToMany(cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	private List<FileGroup> files;
	
	@OneToOne(mappedBy="courseDetails")
	private Course course;
	
	public CourseDetails() {
		this.forum = new Forum();
		this.files =  new ArrayList<>();
	}

	public CourseDetails(Course course) {
		this.course = course;
		this.forum = new Forum();
		this.files =  new ArrayList<>();
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

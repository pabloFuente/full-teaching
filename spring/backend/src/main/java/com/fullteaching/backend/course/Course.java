package com.fullteaching.backend.course;

import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashSet;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.OneToMany;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.session.Session;
import com.fullteaching.backend.coursedetails.CourseDetails;

@Entity
public class Course {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	private String image;
	
	@JsonIgnore
	@ManyToOne
	private User teacher;
	
	@JsonIgnore
	@OneToOne(cascade=CascadeType.ALL)
	private CourseDetails courseDetails;
	
	@OneToMany(fetch = FetchType.EAGER, cascade=CascadeType.ALL, mappedBy="course")
	private Set<Session> sessions;
	
	@JsonIgnore
	@ManyToMany
	private List<User> attenders;
	
	public Course() {}
	
	public Course(String title, String image, User teacher) {
		this.title = title;
		this.image = image;
		this.teacher = teacher;
		this.courseDetails = null;
		this.sessions = new HashSet<>();
		this.attenders = new ArrayList<>();
	}

	public Course(String title, String image, User teacher, CourseDetails courseDetails) {
		this.title = title;
		this.image = image;
		this.teacher = teacher;
		this.courseDetails = courseDetails;
		this.sessions = new HashSet<>();
		this.attenders = new ArrayList<User>();
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public User getTeacher() {
		return teacher;
	}

	public void setTeacher(User teacher) {
		this.teacher = teacher;
	}

	public CourseDetails getCourseDetails() {
		return courseDetails;
	}

	public void setCourseDetails(CourseDetails courseDetails) {
		this.courseDetails = courseDetails;
	}

	public List<User> getAttenders() {
		return attenders;
	}

	public void setAttenders(List<User> attenders) {
		this.attenders = attenders;
	}

	public Set<Session> getSessions() {
		return sessions;
	}

	public void setSessions(Set<Session> sessions) {
		this.sessions = sessions;
	}
}

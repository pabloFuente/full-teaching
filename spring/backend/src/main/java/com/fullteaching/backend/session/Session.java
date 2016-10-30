package com.fullteaching.backend.session;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fullteaching.backend.course.Course;

@Entity
public class Session {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	private String description;
	
	private long date;
	
	@JsonIgnore
	@ManyToOne
	private Course course;
	
	public Session() {}
	
	public Session(String title, String description, long date) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.course = null;
	}

	public Session(String title, String description, long date, Course course) {
		this.title = title;
		this.description = description;
		this.date = date;
		this.course = course;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public long getDate() {
		return date;
	}

	public void setDate(long date) {
		this.date = date;
	}

	public Course getCourse() {
		return course;
	}

	public void setCourse(Course course) {
		this.course = course;
	}
	
}

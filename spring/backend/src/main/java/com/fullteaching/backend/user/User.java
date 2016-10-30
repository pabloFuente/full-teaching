package com.fullteaching.backend.user;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ElementCollection;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import com.fullteaching.backend.course.Course;

@Entity
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String email;
	
	private String name;
	
	@ElementCollection(fetch = FetchType.EAGER)
	private List<String> roles;
	
	private String picture;
	
	private long registrationDate;
	
	@JsonProperty(access = Access.WRITE_ONLY)
	private String passwordHash;
	
	@ManyToMany(mappedBy="attenders")
	private List<Course> courses;
	
	public User() {}
	
	public User(String email, String password, String name, String picture, String... roles){
		this.email = email;
		this.name = name;
		this.roles = new ArrayList<>(Arrays.asList(roles));
		this.picture = picture;
		this.registrationDate = System.currentTimeMillis();
		this.passwordHash = new BCryptPasswordEncoder().encode(password);
		this.courses = new ArrayList<>();
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public List<Course> getCourses() {
		return courses;
	}

	public void setCourses(List<Course> courses) {
		this.courses = courses;
	}

	public List<String> getRoles() {
		return roles;
	}

	public void setRoles(List<String> roles) {
		this.roles = roles;
	}

	public long getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(long registrationDate) {
		this.registrationDate = registrationDate;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

}

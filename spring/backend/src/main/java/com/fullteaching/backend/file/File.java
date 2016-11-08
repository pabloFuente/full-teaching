package com.fullteaching.backend.file;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class File {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private int type;
	
	private String name;
	
	private String link;
	
	public File() {}
	
	public File(int type, String name, String link) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.link = link;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

}

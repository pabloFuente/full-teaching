package com.fullteaching.backend.file;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
public class File {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private int type;
	
	private String name;
	
	private String nameIdent;
	
	private String link;
	
	private int indexOrder;
	
	public File() {}
	
	public File(int type, String name) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = "";
	}
	
	public File(int type, String name, String link) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = link;
	}
	
	public File(int type, String name, String link, int indexOrder) {
		this.type = type; //0: web-link | 1: pdf | 2: video
		this.name = name;
		this.nameIdent = generateNameIdent(name);
		this.link = link;
		this.indexOrder = indexOrder;
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
	
	public String getNameIdent() {
		return nameIdent;
	}

	public void setNameIdent(String nameIdent) {
		this.nameIdent = nameIdent;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public int getIndexOrder() {
		return indexOrder;
	}

	public void setIndexOrder(int indexOrder) {
		this.indexOrder = indexOrder;
	}
	
	@Override
	public boolean equals(Object other){
	    if (other == null) return false;
	    if (other == this) return true;
	    if (!(other instanceof File))return false;
	    File otherFile = (File)other;
	    return (otherFile.id == this.id);
	}
	
	public String getFileExtension(){
		return this.nameIdent.substring(this.nameIdent.lastIndexOf('.') + 1);
	}
	
	//Generates a string which acts as an identifier for the stored file in the system (local, S3...)
	private String generateNameIdent(String originalName){
		String s = originalName + (Math.random() * (Integer.MIN_VALUE - Integer.MAX_VALUE));
		s = new BCryptPasswordEncoder().encode(s);
		s = s.replaceAll("[^A-Za-z0-9\\$]", "");
		int i = originalName.lastIndexOf('.');
		if (i >= 0) s += originalName.substring(i);
		return s;
	}

}

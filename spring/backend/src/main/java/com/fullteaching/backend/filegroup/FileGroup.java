package com.fullteaching.backend.filegroup;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.file.File;

@Entity
public class FileGroup {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<File> files;
	
	@OneToMany(mappedBy="fileGroupParent", cascade=CascadeType.ALL, fetch = FetchType.EAGER)
	private List<FileGroup> fileGroups;
	
	@JsonIgnore
	@ManyToOne
	private FileGroup fileGroupParent;
	
	public FileGroup() {}
	
	public FileGroup(String title) {
		this.title = title;
		this.files = new ArrayList<>();
		this.fileGroups = new ArrayList<>();
		this.fileGroupParent = null;
	}
	
	public FileGroup(String title, FileGroup fileGroupParent) {
		this.title = title;
		this.files = new ArrayList<>();
		this.fileGroups = new ArrayList<>();
		this.fileGroupParent = fileGroupParent;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public List<File> getFiles() {
		return files;
	}

	public void setFiles(List<File> files) {
		this.files = files;
	}

	public List<FileGroup> getFileGroups() {
		return fileGroups;
	}

	public void setFileGroups(List<FileGroup> fileGroups) {
		this.fileGroups = fileGroups;
	}
	
	public FileGroup getFileGroupParent() {
		return fileGroupParent;
	}

	public void setFileGroupParent(FileGroup fileGroupParent) {
		this.fileGroupParent = fileGroupParent;
	}
	

}

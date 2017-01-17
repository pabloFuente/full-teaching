package com.fullteaching.backend.filegroup;

import java.util.List;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fullteaching.backend.file.File;

@Entity
public class FileGroup {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private long id;
	
	private String title;
	
	@OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
	@OrderBy("indexOrder ASC")
	@JoinColumn
	private List<File> files;
	
	@OneToMany(mappedBy="fileGroupParent", cascade=CascadeType.ALL)
	@JsonManagedReference
	private List<FileGroup> fileGroups;
	
	@ManyToOne
	@JsonBackReference
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
	
	//To make 'courseDetails.getFiles().remove(file)' possible
	@Override
	public boolean equals(Object other){
	    if (other == null) return false;
	    if (other == this) return true;
	    if (!(other instanceof FileGroup))return false;
	    FileGroup otherFileGroup = (FileGroup)other;
	    return (otherFileGroup.id == this.id);
	}
	
	public void updateFileIndexOrder (){
		int i = 0;
		for (File f : this.getFiles()){
			f.setIndexOrder(i);
			i++;
		}
	} 
	
}

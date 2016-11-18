package com.fullteaching.backend.file;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.fullteaching.backend.filegroup.FileGroup;
import com.fullteaching.backend.filegroup.FileGroupRepository;

@RestController
@RequestMapping("/load-files")
public class FileController {
	
	@Autowired
	private FileGroupRepository fileGroupRepository;

	private static final Path FILES_FOLDER = Paths.get(System.getProperty("user.dir"), "files");

	@RequestMapping(value = "/upload/{fileGroupId}", method = RequestMethod.POST)
	public ResponseEntity<FileGroup> handleFileUpload(MultipartHttpServletRequest request, @PathVariable(value="fileGroupId") String fileGroupId) throws IOException {
		
		long id_fileGroup = -1;
		try {
			id_fileGroup = Long.parseLong(fileGroupId);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		FileGroup fg = null;
		Iterator<String> i = request.getFileNames();
		while (i.hasNext()) {
			String name = i.next();
			System.out.println("X - " + name);
			MultipartFile file = request.getFile(name);
			
			System.out.println("FILE: " + file.getOriginalFilename());
		
			if (file.isEmpty()) {
				
				System.out.println("EXCEPTION!");
				
				throw new RuntimeException("The file is empty");
			}
	
			if (!Files.exists(FILES_FOLDER)) {
				
				System.out.println("PATH CREATED");
				
				Files.createDirectories(FILES_FOLDER);
			}
	
			String fileName = file.getOriginalFilename();
			File uploadedFile = new File(FILES_FOLDER.toFile(), fileName);
			file.transferTo(uploadedFile);
			
			fg = fileGroupRepository.findOne(id_fileGroup);
			fg.getFiles().add(new com.fullteaching.backend.file.File(1, file.getOriginalFilename(), uploadedFile.getPath()));
			
			System.out.println("FILE UPLOADED SUCCESFULL TO " + uploadedFile.getPath());
		}
		
		fileGroupRepository.save(fg);
		System.out.println("FINISHING METHOD!");
		return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.CREATED);
	}

	
	@RequestMapping("/download/{fileName:.+}")
	public void handleFileDownload(@PathVariable String fileName, HttpServletResponse res)
			throws FileNotFoundException, IOException {
		
		Path file = FILES_FOLDER.resolve(fileName);

		if (Files.exists(file)) {
			System.out.println("DOWNLOADING FILE "+ file.toString());
			res.setContentType("text/plain");
			res.setContentLength((int) file.toFile().length());
			FileCopyUtils.copy(Files.newInputStream(file), res.getOutputStream());
			
		} else {
			res.sendError(404, "File" + fileName + "(" + file.toAbsolutePath() + ") does not exist");
		}
	}
	
	//Method to get the root FileGroup of a FileGroup tree structure, given a FileGroup
	private FileGroup getRootFileGroup(FileGroup fg) {
		while(fg.getFileGroupParent() != null){
			fg = fg.getFileGroupParent();
		}
		return fg;
	}

}
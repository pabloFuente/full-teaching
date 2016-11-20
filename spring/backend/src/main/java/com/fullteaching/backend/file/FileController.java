package com.fullteaching.backend.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;

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
	
	private static final MimeTypes MIME_TYPES = new MimeTypes();

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
			fg.updateFileIndexOrder();
			
			System.out.println("FILE UPLOADED SUCCESFULL TO " + uploadedFile.getPath());
		}
		
		fileGroupRepository.save(fg);
		System.out.println("FINISHING METHOD!");
		return new ResponseEntity<>(this.getRootFileGroup(fg), HttpStatus.CREATED);
	}

	
	@RequestMapping("/download/{fileName:.+}")
	public void handleFileDownload(@PathVariable String fileName, HttpServletResponse response)
			throws FileNotFoundException, IOException {
		
		Path file = FILES_FOLDER.resolve(fileName);

		if (Files.exists(file)) {
			try {
				String fileExt = this.getFileExtension(fileName);
				switch (fileExt){
					case "pdf": 
						response.setContentType(MimeTypes.MIME_APPLICATION_PDF);
						break;
					case "txt":
						response.setContentType(MimeTypes.MIME_TEXT_PLAIN);
						break;
				}
						
				// get your file as InputStream
				InputStream is = new FileInputStream(file.toString());
				// copy it to response's OutputStream
				IOUtils.copy(is, response.getOutputStream());
				response.flushBuffer();
			} catch (IOException ex) {
				throw new RuntimeException("IOError writing file to output stream");
			}
			
		} else {
			response.sendError(404, "File" + fileName + "(" + file.toAbsolutePath() + ") does not exist");
		}
	}
	
	//Method to get the root FileGroup of a FileGroup tree structure, given a FileGroup
	private FileGroup getRootFileGroup(FileGroup fg) {
		while(fg.getFileGroupParent() != null){
			fg = fg.getFileGroupParent();
		}
		return fg;
	}
	
	private String getFileExtension(String name){
		String[] aux = name.split("\\.");
		String ext = aux[aux.length - 1];
		return MimeTypes.getMimeType(ext);
	}

}
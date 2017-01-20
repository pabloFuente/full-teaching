package com.fullteaching.backend.filereader;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.apache.tika.exception.TikaException;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.xml.sax.SAXException;

public class FileReader {
	
	public String parseToPlainText(File file) throws Exception {
		
		InputStream fileStream = new FileInputStream(file);
	    org.xml.sax.ContentHandler handler = new BodyContentHandler();
	    AutoDetectParser parser = new AutoDetectParser();
	    ParseContext context = new ParseContext();
	    Metadata metadata = new Metadata();
	    
	    try {
	    	System.out.println("Starting parsing...");
	        parser.parse(fileStream, handler, metadata, context);
	        System.out.println("Parsing finished...");
	        return handler.toString();
	    }
	    catch (IOException | SAXException | TikaException e) {
	    	System.out.println("Exception 1!");
			throw new Exception("TIKA was not able to exctract text of file '" + file.getName() + "'");
		} finally {
			try {
				System.out.println("Closing file...");
				fileStream.close();
			} catch (IOException e) {
				System.out.println("Exception 2!");
				throw new Exception(e);
			}
		}
	}
}

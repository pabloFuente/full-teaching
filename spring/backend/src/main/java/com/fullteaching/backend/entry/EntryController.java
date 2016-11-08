package com.fullteaching.backend.entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fullteaching.backend.forum.Forum;
import com.fullteaching.backend.forum.ForumRepository;
import com.fullteaching.backend.user.User;
import com.fullteaching.backend.user.UserComponent;

@RestController
@RequestMapping("/entries")
public class EntryController {
	
	@Autowired
	private ForumRepository forumRepository;
	
	@Autowired
	private UserComponent user;
	
	@RequestMapping(value = "/forum/{id}", method = RequestMethod.POST)
	public ResponseEntity<Forum> newEntry(@RequestBody Entry entry, @PathVariable(value="id") String id) {
		long id_i = -1;
		try {
			id_i = Long.parseLong(id);
		} catch(NumberFormatException e){
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		Forum forum = forumRepository.findOne(id_i);
		if(forum != null){
			
			//Setting the author of the entry
			User userLogged = user.getLoggedUser();
			entry.setUser(userLogged);
			
			//Setting the author and date of its first comment
			entry.getComments().get(0).setUser(userLogged);
			entry.getComments().get(0).setDate(System.currentTimeMillis());
			
			//Setting the date of the entry
			entry.setDate(System.currentTimeMillis());
			
			forum.getEntries().add(entry);
			/*Saving the modified forum: Cascade relationship between forum and entries
			  will add the new entry to EntryRepository*/
			forumRepository.save(forum);
			/*Entire forum is returned in order to have the new entry ID available just
			in case the author wants to add to it a new comment without refreshing the page*/
			return new ResponseEntity<>(forum, HttpStatus.CREATED);
		}else{
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
	}

}

package com.fullteaching.backend.unitary.comment;


import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.user.User;

public class CommentUnitaryTest extends AbstractUnitTest {

	@Before
	public void setUp() throws Exception {
	}

	@Test
	public void newForumEntryCommentTest() {
		Comment cm = new Comment();
		Assert.notNull(cm);
		
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);
		Long date = System.currentTimeMillis();
		String message = "This is the message";
		Comment cm2 = new Comment(message, date, u);
	
		Assert.notNull(cm2);
		Assert.notNull(cm2.getReplies());
		Assert.isTrue(u.equals(cm2.getUser()));
		Assert.isTrue(date== cm2.getDate());
		Assert.isTrue(message.equals(cm2.getMessage()));
		
		Comment cm3 = new Comment(message, date, u, cm2);
		
		Assert.notNull(cm3);
		Assert.notNull(cm3.getReplies());
		Assert.isTrue(u.equals(cm3.getUser()));
		Assert.isTrue(date== cm3.getDate());
		Assert.isTrue(message.equals(cm3.getMessage()));
		Assert.isTrue(cm2.equals(cm3.getCommentParent()));
	}


	@Test
	public void setAndGetCommentMessageTest() {
		Comment cm = new Comment();
		String message = "This is the message";
		cm.setMessage(message);
		Assert.notNull(cm);
		Assert.isTrue(message.equals(cm.getMessage()));
	}

	@Test
	public void setAndGetCommentDateTest() {
		Comment cm = new Comment();
		Long date = System.currentTimeMillis();
		cm.setDate(date);
		Assert.notNull(cm);
		Assert.isTrue(date== cm.getDate());
	}

	@Test
	public void setAndGetCommentRepliesTest() {
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);
		Long date = System.currentTimeMillis();
		String message = "This is the message";
		Comment rep = new Comment(message, date, u);
		
		List<Comment> replies = new ArrayList<Comment>();
		replies.add(rep);
		
		Comment cm = new Comment();
		cm.setReplies(replies);
		Assert.notNull(cm);
		Assert.notNull(cm.getReplies());
		Assert.isTrue(replies.equals(cm.getReplies()));
	}

	@Test
	public void setAndGetCommentUserTest() {
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);
		
		Comment cm = new Comment();
		cm.setUser(u);
		Assert.notNull(cm);
	}

	@Test
	public void setAndGetCommentParentTest() {
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);
		Long date = System.currentTimeMillis();
		String message = "This is the message";
		Comment parent = new Comment(message, date, u);
		
		Comment cm = new Comment();
		cm.setCommentParent(parent);
		Assert.notNull(cm);
	}

}

package com.fullteaching.backend.unitary.entry;


import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.comment.Comment;
import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.user.User;

public class EntryUnitaryTest extends AbstractUnitTest {

	@Before
	public void setUp() throws Exception {
	}


	@Test
	public void newForumEntryTest() {
		String[] roles = {"TEACHER"};
		User u =  new User("mock", "Pass1234", "mock", null, roles);
		long date = System.currentTimeMillis();
		
		Entry e2 = new Entry();
		Assert.notNull(e2);
		
		Entry e = new Entry("Test Entry",date,u);
		Assert.notNull(e);
		Assert.isTrue("Test Entry".equals(e.getTitle()));
		Assert.isTrue(date==e.getDate());
		Assert.isTrue(u.equals(e.getUser()));
	}

	@Test
	public void setAndGetEntryTitleTest() {
		Entry e = new Entry();
		e.setTitle("This title");
		Assert.notNull(e);
		Assert.isTrue("This title".equals(e.getTitle()));
	}

	@Test
	public void setAndGetEntryDateTest() {
		Entry e = new Entry();
		long date = System.currentTimeMillis();
		e.setDate(date);
		Assert.notNull(e);
		Assert.isTrue(date==e.getDate());

	}

	@Test
	public void setAndGetEntryUserTest() {
		String[] roles = {"TEACHER"};

		User u =  new User("mock", "Pass1234", "mock", null, roles);

		Entry e = new Entry();
		Assert.notNull(e);
		e.setUser(u);
		Assert.isTrue(u.equals(e.getUser()));

	}

	@Test
	public void setAndGetEntryCommentsTest() {

		List<Comment> comments = new ArrayList<Comment>();
		
		Entry e = new Entry();
		e.setComments(comments);
		Assert.notNull(e);
		Assert.isTrue(comments.equals(e.getComments()));

	}

}

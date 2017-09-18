package com.fullteaching.backend.unitary.forum;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.entry.Entry;
import com.fullteaching.backend.forum.Forum;

public class ForumUnitaryTest extends AbstractUnitTest {

	
	@Test
	public void newForumTest() {
		Forum f = new Forum();
		Assert.notNull(f);
		
		Forum f2 = new Forum(true);
		Assert.notNull(f2);
		Assert.isTrue(f2.isActivated());
		
		Forum f3 = new Forum(false);
		Assert.notNull(f3);
		Assert.isTrue(!f3.isActivated());
	}

	
	@Test
	public void activateAndDeactivateTest() {
		Forum f = new Forum();
		f.setActivated(true);
		Assert.isTrue(f.isActivated());
		
		f.setActivated(false);
		Assert.isTrue(!f.isActivated());
		
	}

	@Test
	public void testGetEntries() {
		Forum f = new Forum();
		List<Entry> entries = new ArrayList<Entry>();
		
		f.setEntries(entries);
		
		Assert.notNull(f);
		Assert.isTrue(f.getEntries().equals(entries));
	}

}

package com.fullteaching.backend.unitary.file;

import org.junit.Before;
import org.junit.Test;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.file.File;

public class FileUnitaryTest extends AbstractUnitTest {

	static int filetype = 0;
	static String filename = "FileNAME.doc";
	static String filelink = "this link";
	static int fileorder = 1;

	
	@Before
	public void setUp() throws Exception {

	}

	@Test
	public void newFileTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		//No possiblity of test as Random is used
		//Assert.isTrue(encoder.matches(filename, f1.getNameIdent()));
		
		
		File f2 = new File (filetype, filename, filelink);
		Assert.notNull(f2);
		Assert.isTrue(filetype==f2.getType());
		Assert.isTrue(filename.equals(f2.getName()));
		Assert.isTrue(filelink.equals(f2.getLink()));
		//No possiblity of test as Random is used
		//Assert.isTrue(encoder.matches(filename, f2.getNameIdent()));
		
		File f3 = new File (filetype, filename, filelink, fileorder);
		Assert.notNull(f3);
		Assert.isTrue(filetype==f3.getType());
		Assert.isTrue(filename.equals(f3.getName()));
		Assert.isTrue(filelink.equals(f3.getLink()));
		Assert.isTrue(fileorder==f3.getIndexOrder());
		//No possiblity of test as Random is used
		//Assert.isTrue(encoder.matches(filename, f3.getNameIdent()));
		
		File f4 = new File (filetype, ".doc");
		Assert.notNull(f4);
		Assert.isTrue(filetype==f4.getType());
		Assert.isTrue(".doc".equals(f4.getName()));
		Assert.isTrue(f4.getNameIdent().contains(".doc"));
		//No possiblity of test as Random is used
		//Assert.isTrue(encoder.matches(filename, f1.getNameIdent()));
		
	}
	

	@Test
	public void setAndGetFileIdTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setId(0);
		Assert.isTrue(0==f1.getId());
	}

	@Test
	public void setAndGetFileTypeTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setType(1);
		Assert.isTrue(1==f1.getType());

	}

	@Test
	public void setAndGetFileNameTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setName("test_name");
		Assert.isTrue("test_name".equals(f1.getName()));
	}

	@Test
	public void setAndGetFileNameIdentTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setNameIdent("NAME_IDENT");
		Assert.isTrue("NAME_IDENT".equals(f1.getNameIdent()));

	}

	@Test
	public void setAndGetFileLinkTest() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setLink(filelink);
		Assert.isTrue(filelink.equals(f1.getLink()));
	}

	@Test
	public void testGetIndexOrder() {
		File f1 = new File (filetype, filename);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		f1.setIndexOrder(5);
		Assert.isTrue(5 == f1.getIndexOrder());
	}

	@Test
	public void testEqualsObject() {
		File f1 = new File (filetype, filename);
		f1.setId(5);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		File f2 = new File (filetype, filename);
		f2.setId(2);
		Assert.notNull(f2);
		Assert.isTrue(filetype==f2.getType());
		Assert.isTrue(filename.equals(f2.getName()));
		
		File f3 = new File (filetype, filename);
		f3.setId(5);
		Assert.notNull(f3);
		Assert.isTrue(filetype==f3.getType());
		Assert.isTrue(filename.equals(f3.getName()));
		
		
		Assert.isTrue(f1.equals(f3));
		Assert.isTrue(!f1.equals(null));
		Assert.isTrue(!f1.equals("not a file"));
		Assert.isTrue(!f1.equals(f2));
	}

	@Test
	public void getFileExtTest() {
		File f1 = new File (filetype, filename);
		f1.setId(5);
		Assert.notNull(f1);
		Assert.isTrue(filetype==f1.getType());
		Assert.isTrue(filename.equals(f1.getName()));
		
		Assert.isTrue("doc".equals(f1.getFileExtension()));
	}

}

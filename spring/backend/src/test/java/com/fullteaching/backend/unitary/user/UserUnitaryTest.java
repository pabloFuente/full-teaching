/**
 * 
 */
package com.fullteaching.backend.unitary.user;

import java.util.Arrays;

import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.util.Assert;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.user.User;

/**
 * @author gtunon
 *
 */
/*@Transactional After each test the BBDD is rolled back*/
// @Transactional not necessary here
public class UserUnitaryTest extends AbstractUnitTest {

	/*Test user data*/
	String name = "TestUser";
	String password = "blablaba";
	String nickName = "testi";
	String picture = "picture/test.jpg";
	String[] roles = {"STUDENT"};
	
	
	/**
	 * Test method for {@link com.fullteaching.backend.user.User#User(java.lang.String, java.lang.String, java.lang.String, java.lang.String, java.lang.String[])}
	 * and {@link com.fullteaching.backend.user.User#User()}.
	 */
	@Test
	public void newUserTest() {
		
		//Empty user
		User emptyUser = new User();
		Assert.notNull(emptyUser, "User failed to be created");
		
		//User with picture
		User u = new User(name, password, nickName, picture,roles);
		Assert.notNull(u, "User failed to be created");
		Assert.isTrue(name.equals(u.getName()), "User failed to be created");
		Assert.isTrue((new BCryptPasswordEncoder()).matches(password, u.getPasswordHash()), "User failed to be created");
		Assert.isTrue(nickName.equals(u.getNickName()), "User failed to be created");
		Assert.isTrue(picture.equals(u.getPicture()), "User failed to be created");
		Assert.isTrue(roles.length == u.getRoles().size(), "User failed to be created");
		
		//user witout picture
		u = new User(name, password, nickName, null,roles);
		Assert.notNull(u, "User failed to be created");
		Assert.isTrue(name.equals(u.getName()), "User failed to be created");
		Assert.isTrue((new BCryptPasswordEncoder()).matches(password, u.getPasswordHash()), "User failed to be created");
		Assert.isTrue(nickName.equals(u.getNickName()), "User failed to be created");
		Assert.notNull(u.getPicture(), "User failed to be created");
		Assert.isTrue(roles.length == u.getRoles().size(), "User failed to be created");
	}

	/**
	 * Test method for {@link com.fullteaching.backend.user.User#getName()}.
	 * and {@link com.fullteaching.backend.user.User#setName(java.lang.String)}.
	 */
	@Test
	public void setAndGetUserNameTest() {
		User u = new User();
		u.setName(name);
		Assert.isTrue(name.equals(u.getName()), "testSetAndGetUserName FAIL");
	}


	/**
	 * Test method for {@link com.fullteaching.backend.user.User#setPasswordHash(java.lang.String)}
	 * and {@link com.fullteaching.backend.user.User#getPasswordHash()}.
	 */
	@Test
	public void setAndGetHashPasswordTest() {
		User u = new User();
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		u.setPasswordHash(encoder.encode(password));
		Assert.isTrue(encoder.matches(password, u.getPasswordHash()), "setAndGetHashPasswordTest FAIL");
	}
	
	/**
	 * Test method for {@link com.fullteaching.backend.user.User#getRoles()}
	 * and  {@link com.fullteaching.backend.user.User#setRoles(java.util.List)}.
	 */
	@Test
	public void setAndGetUserRolesTest() {
		User u = new User();	
		u.setRoles(Arrays.asList(roles));
		Assert.isTrue(roles.length == u.getRoles().size(), "SetAndGetUserRolesTest FAIL");
	}

	/**
	 * Test method for {@link com.fullteaching.backend.user.User#getNickName()} 
	 * and {@link com.fullteaching.backend.user.User#setNickName(java.lang.String)}.
	 */
	@Test
	public void setAndGetUserNickNameTest() {
		User u = new User();
		u.setNickName(nickName);
		Assert.isTrue(nickName.equals(u.getNickName()), "SetAndGetUserNickNameTest FAIL");
	}

	/**
	 * Test method for {@link com.fullteaching.backend.user.User#getPicture()} 
	 * and {@link com.fullteaching.backend.user.User#setPicture(java.lang.String)}.
	 */
	@Test
	public void setAndGetUserPictureTest() {
		User u = new User();
		u.setPicture(picture);
		Assert.isTrue(picture.equals(u.getPicture()), "SetAndGetUserPictureTest FAIL");
	}

	/**
	 * Test method for {@link com.fullteaching.backend.user.User#getRegistrationDate()} 
	 * and {@link com.fullteaching.backend.user.User#setRegistrationDate(long)}.
	 */
	@Test
	public void setAndGetUserRegistrationDateTest() {
		User u = new User();
		Long date = System.currentTimeMillis();
		u.setRegistrationDate(date);
		Assert.isTrue(date==u.getRegistrationDate());
	}


	/**
	 * Test method for {@link com.fullteaching.backend.user.User#equals(java.lang.Object)}.
	 */
	@Test
	public void equalUserTest() {
		User u1 = new User(name, password, nickName, picture,roles);
		User u2 = new User(name, password, nickName, picture,roles);
		Assert.isTrue(u1.equals(u2), "EqualUserTest FAIL");
		Assert.isTrue(!u1.equals("not An User"), "EqualUserTest FAIL");
		Assert.isTrue(u1.equals(u1), "EqualUserTest FAIL");		
		Assert.isTrue(!u1.equals(null), "EqualUserTest FAIL");
	}



}

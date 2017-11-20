/*
 * (C) Copyright 2017 OpenVidu (http://openvidu.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.fullteaching.backend.e2e;

import static java.lang.invoke.MethodHandles.lookup;
import static org.slf4j.LoggerFactory.getLogger;

import java.util.concurrent.TimeUnit;

import static java.lang.System.getProperty;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.After;
import org.junit.Assert;
import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;

import io.github.bonigarcia.SeleniumExtension;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import io.github.bonigarcia.wdm.FirefoxDriverManager;

/**
 * E2E tests for openvidu-testapp.
 *
 * @author Pablo Fuente (pablo.fuente@urjc.es)
 * @since 1.1.1
 */
@Tag("e2e")
@DisplayName("E2E tests for OpenVidu TestApp")
@ExtendWith(SeleniumExtension.class)
@RunWith(JUnitPlatform.class)
public class FullTeachingTestE2E {

	static String APP_URL = "https://localhost:5000/";
	static Exception ex = null;
	
	final static Logger log = getLogger(lookup().lookupClass());

	BrowserUser user;

	@BeforeAll()
	static void setupAll() {
		
		if(System.getenv("ET_EUS_API") == null) {
			//Outside ElasTest
			ChromeDriverManager.getInstance().setup();
			FirefoxDriverManager.getInstance().setup();	
		}
		
		if (System.getenv("ET_SUT_HOST") != null) {
			APP_URL = "https://" + System.getenv("ET_SUT_HOST") + ":5000/";
		}
		
		log.info("Using URL {} to connect to openvidu-testapp", APP_URL);

	}

	void setupBrowser(String browser) {
		
		switch (browser) {
			case "chrome":
				this.user = new ChromeUser("TestUser", 50);
				break;
			case "firefox":
				this.user = new FirefoxUser("TestUser", 50);
				break;
			default:
				this.user = new ChromeUser("TestUser", 50);
		}

		user.getDriver().get(APP_URL);
		
		final String GLOBAL_JS_FUNCTION = 
				"var s = window.document.createElement('script');"
				+ "s.innerText = 'window.MY_FUNC = function(containerQuerySelector) {"
				+ "var elem = document.createElement(\"div\");"
				+ "elem.id = \"video-playing-div\";"
				+ "elem.innerText = \"VIDEO PLAYING\";"
				+ "document.body.appendChild(elem);"
				+ "console.error(\"ERRRRORRRR!!!!\")}';"
				+ "window.document.head.appendChild(s);";
		
		user.runJavascript(GLOBAL_JS_FUNCTION);
	}

	@AfterEach
	void dispose() {
		
	    this.logut(user);
	    
		user.dispose();
	}

	@Test
	@DisplayName("Test video session")
	void oneToOneVideoAudioSessionChrome() throws Exception {
		
		final String userEmail = "teacher@gmail.com";
		final String userPass = "pass";
		
		String brow = System.getenv("browser");
		
		if (brow != null && (brow.equals("chrome") || brow.equals("firefox"))) {
			setupBrowser(brow);
		} else {
			setupBrowser("chrome");
		}

		log.info("Test video session");
		
		this.login(user, userEmail, userPass);
	    
	    user.getWaiter().until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(("ul.collection li.collection-item:first-child div.course-title"))));
	    user.getDriver().findElement(By.cssSelector("ul.collection li.collection-item:first-child div.course-title")).click();
	    
	    user.getWaiter().until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(("#md-tab-label-0-1"))));
	    user.getDriver().findElement(By.cssSelector("#md-tab-label-0-1")).click();
	    
	    user.getDriver().findElement(By.cssSelector("ul div:first-child li.session-data div.session-ready")).click();

		System.out.println("-------------------- WAITING ------------------------");

		Thread.sleep(5000);
	    
	    user.getWaiter().until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(("div.participant video"))));
	    
	    checkVideoPlaying(user, user.getDriver().findElement(By.cssSelector(("div.participant video"))), "div.participant");

	}

	/*@Test
	@DisplayName("Cross-Browser test")
	void crossBrowserTest() throws Exception {
		
		setupBrowser("chrome");

		log.info("Cross-Browser test");

		Thread.UncaughtExceptionHandler h = new Thread.UncaughtExceptionHandler() {
			public void uncaughtException(Thread th, Throwable ex) {
				System.out.println("Uncaught exception: " + ex);
				synchronized (lock) {
					OpenViduTestAppE2eTest.ex = new Exception(ex);
				}
			}
		};

		Thread t = new Thread(() -> {
			BrowserUser user2 = new FirefoxUser("TestUser", 30);
			user2.getDriver().get(APP_URL);
			WebElement urlInput = user2.getDriver().findElement(By.id("openvidu-url"));
			urlInput.clear();
			urlInput.sendKeys(OPENVIDU_URL);
			WebElement secretInput = user2.getDriver().findElement(By.id("openvidu-secret"));
			secretInput.clear();
			secretInput.sendKeys(OPENVIDU_SECRET);

			user2.getEventManager().startPolling();

			user2.getDriver().findElement(By.id("add-user-btn")).click();
			user2.getDriver().findElement(By.className("join-btn")).click();
			try {
				user2.getEventManager().waitUntilNumberOfEvent("videoPlaying", 2);
				Assert.assertTrue(user2.getEventManager()
						.assertMediaTracks(user2.getDriver().findElements(By.tagName("video")), true, true));
				user2.getEventManager().waitUntilNumberOfEvent("streamDestroyed", 1);
				user2.getDriver().findElement(By.id("remove-user-btn")).click();
				user2.getEventManager().waitUntilNumberOfEvent("sessionDisconnected", 1);
			} catch (Exception e) {
				e.printStackTrace();
				Thread.currentThread().interrupt();
			}
			user2.dispose();
		});
		t.setUncaughtExceptionHandler(h);
		t.start();

		user.getDriver().findElement(By.id("add-user-btn")).click();
		user.getDriver().findElement(By.className("join-btn")).click();

		user.getEventManager().waitUntilNumberOfEvent("videoPlaying", 2);
		
		try {
			System.out.println(getBase64Screenshot(user));
		} catch (Exception e) {
			e.printStackTrace();
		}

		Assert.assertTrue(user.getEventManager().assertMediaTracks(user.getDriver().findElements(By.tagName("video")),
				true, true));

		user.getDriver().findElement(By.id("remove-user-btn")).click();

		user.getEventManager().waitUntilNumberOfEvent("sessionDisconnected", 1);

		t.join();

		synchronized (lock) {
			if (OpenViduTestAppE2eTest.ex != null) {
				throw OpenViduTestAppE2eTest.ex;
			}
		}
	}*/
	
	private void login(BrowserUser user, String userEmail, String userPass) {
		user.getDriver().findElement(By.id("download-button")).click();

		// Find form elements (login modal is already opened)
	    WebElement userNameField = user.getDriver().findElement(By.id("email"));
	    WebElement userPassField = user.getDriver().findElement(By.id("password"));

	    // Fill input fields
	    userNameField.sendKeys(userEmail);
	    userPassField.sendKeys(userPass);

	    // Ensure fields contain what has been entered
	    Assert.assertEquals(userNameField.getAttribute("value"), userEmail);
	    Assert.assertEquals(userPassField.getAttribute("value"), userPass);
	    
	    user.getDriver().findElement(By.id("log-in-btn")).click();
	}
	
	private void logut(BrowserUser user) {
		if (user.getDriver().findElements(By.cssSelector("#fixed-icon")).size() > 0) {
			// Get out of video session page
			user.getDriver().findElement(By.cssSelector("#fixed-icon")).click();
		    watiForAngularAnimations(500);
		    user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.cssSelector("#exit-icon")));
		    user.getDriver().findElement(By.cssSelector("#exit-icon")).click();
		}
		//if (user.getDriver().findElements(By.cssSelector("#arrow-drop-down")).size() > 0) {
		try {
			// Up bar menu
			user.getWaiter().withTimeout(1000, TimeUnit.MILLISECONDS).until(
					ExpectedConditions.visibilityOfElementLocated(By.cssSelector("#arrow-drop-down")));
			user.getDriver().findElement(By.cssSelector("#arrow-drop-down")).click();
		    watiForAngularAnimations(250);
		    user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.cssSelector("#logout-button")));
		    user.getDriver().findElement(By.cssSelector("#logout-button")).click();
		} catch (TimeoutException e) {
			// Shrunk menu
			user.getWaiter().withTimeout(1000, TimeUnit.MILLISECONDS).until(
					ExpectedConditions.visibilityOfElementLocated(By.cssSelector("a.button-collapse")));
			user.getDriver().findElement(By.cssSelector("a.button-collapse")).click();
		    watiForAngularAnimations(250);
		    user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.xpath("//ul[@id='nav-mobile']//a[text() = 'Logout']")));
		    user.getDriver().findElement(By.xpath("//ul[@id='nav-mobile']//a[text() = 'Logout']")).click();
		}
		user.getWaiter().until(ExpectedConditions.elementToBeClickable(By.id("download-button")));
	}
	
	private boolean checkVideoPlaying(BrowserUser user, WebElement videoElement, String containerQuerySelector) {

		// Video element should be in 'readyState'='HAVE_ENOUGH_DATA'
		user.getWaiter().until(ExpectedConditions.attributeToBe(videoElement, "readyState", "4"));
		
		// Video should have a valid 'src' value
		user.getWaiter().until(ExpectedConditions.attributeToBeNotEmpty(videoElement, "src"));
		
		// Video should have a srcObject (type MediaStream) with the attribute 'active' to true
		Assert.assertTrue((boolean) user.runJavascript("return document.querySelector('" + containerQuerySelector
				+ "').getElementsByTagName('video')[0].srcObject.active"));
		
		// Video should trigger 'playing' event
		user.runJavascript("document.querySelector('" + containerQuerySelector
				+ "').getElementsByTagName('video')[0].addEventListener('playing', window.MY_FUNC('" + containerQuerySelector + "'));");
		
		user.getWaiter()
				.until(ExpectedConditions.textToBePresentInElementLocated(By.id("video-playing-div"), "VIDEO PLAYING"));
		user.runJavascript(
				"document.body.removeChild(document.getElementById('video-playing-div'))");

		return true;
	}

	private void watiForAngularAnimations(int milliseconds) {
		try {
			Thread.sleep(milliseconds);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}

}

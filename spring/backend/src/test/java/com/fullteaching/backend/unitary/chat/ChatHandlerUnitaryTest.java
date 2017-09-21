package com.fullteaching.backend.unitary.chat;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import com.fullteaching.backend.AbstractUnitTest;
import com.fullteaching.backend.chat.ChatHandler;

public class ChatHandlerUnitaryTest extends AbstractUnitTest {

	@Autowired
	private ChatHandler chh;
	
	@Mock
	private WebSocketSession session;
	
	@Before
	public void setUp() throws Exception {
	}

	@Ignore
	@Test
	public void testAfterConnectionEstablishedWebSocketSession() {
		try {
			
			chh.afterConnectionEstablished(session);
			Assert.isTrue(true);
		} catch (Exception e) {
			
			e.printStackTrace();
			fail("Exception KO// testAfterConnectionEstablishedWebSocketSession => "+e.getClass().getName());
		}
	}
	


	@Ignore
	@Test
	public void testAfterConnectionClosedWebSocketSessionCloseStatus() {
		try {
			chh.afterConnectionClosed(session, CloseStatus.NORMAL);
			Assert.isTrue(true);

		} catch (Exception e) {
			e.printStackTrace();
			fail("Exception KO// testAfterConnectionClosedWebSocketSessionCloseStatus => "+e.getClass().getName());

		}
	}

}

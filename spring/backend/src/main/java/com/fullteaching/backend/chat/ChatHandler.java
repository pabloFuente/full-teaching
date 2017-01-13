package com.fullteaching.backend.chat;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ChatHandler extends TextWebSocketHandler {

	private ObjectMapper mapper = new ObjectMapper();

	private ChatManager chatManager = new ChatManager(10);

	private String[] colors = {"007AFF", "FF7000", "15E25F", "CFC700", "CFC700", "CF1100", "CF00BE", "F00"};
	
	private volatile int colorIndex = 0;

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {

	}

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message)
			throws Exception {
		System.out.println("Message received: " + message.getPayload());

		String msg = message.getPayload();

		JsonNode jsonMsg = mapper.readTree(msg);
		if (jsonMsg.hasNonNull("chat")) {
			newUser(session, jsonMsg);
		} else {
			newMessage(session, jsonMsg);
		}
	}

	private void newMessage(WebSocketSession session, JsonNode jsonMsg) {
		ChatUser user = (ChatUser) session.getAttributes().get("user");
		Chat chat = (Chat) session.getAttributes().get("chat");

		chat.sendMessage(user, jsonMsg.get("message").asText());
	}

	private void newUser(WebSocketSession session, JsonNode jsonMsg)
			throws InterruptedException, TimeoutException {
		
		String chatName = jsonMsg.get("chat").asText();
		String userName = jsonMsg.get("user").asText();

		WebSocketChatUser user = new WebSocketChatUser(session, userName, colors[colorIndex]);
		colorIndex = (colorIndex+1) % colors.length;
		
		session.getAttributes().put("user", user);	

		chatManager.newUser(user);
		Chat chat = chatManager.newChat(chatName, 5, TimeUnit.SECONDS);
		session.getAttributes().put("chat", chat);

		chat.addUser(user);
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		
		if (session.isOpen()){
			System.out.println("Session OPENED");
		} else{
			System.out.println("Session CLOSED");
		}
		
		ChatUser user = (ChatUser) session.getAttributes().get("user");
		Chat chat = (Chat) session.getAttributes().get("chat");
		
		if(chat != null) {
			chat.removeUser(user);
			if(chat.getUsers().isEmpty()){
				System.out.println("Last user left the room. Closing chat " + chat.getName());
				chat.close();
			}
		}
	}
}

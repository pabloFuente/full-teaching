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
		System.out.println("Connection established..........");
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
		
		System.out.println("-----------------------------------------------------");
		System.out.println("> Number of total users: " + this.chatManager.getUsers().size());
		for (ChatUser us : this.chatManager.getUsers()){
			System.out.println("   -  " + us.getName());
		}
		System.out.println("> Number of chats: " + this.chatManager.getChats().size());
		for (Chat chatty : this.chatManager.getChats()){
			System.out.println("   - Number of users in chat " + chatty.getName() + ": " + chatty.getUsers().size());
			for (ChatUser u : chatty.getUsers()){
				System.out.println("       - " + u.getName());
			}
		}
		System.out.println("-----------------------------------------------------");
		
		ChatUser user = (ChatUser) session.getAttributes().get("user");
		Chat chat = (Chat) session.getAttributes().get("chat");

		chat.sendMessage(user, jsonMsg.get("message").asText());
	}

	private void newUser(WebSocketSession session, JsonNode jsonMsg)
			throws InterruptedException, TimeoutException {
		
		System.out.println("(ChatHandler) newUser");
		
		String chatName = jsonMsg.get("chat").asText();
		String userName = jsonMsg.get("user").asText();

		WebSocketChatUser user = new WebSocketChatUser(session, userName, colors[colorIndex]);
		colorIndex = (colorIndex+1) % colors.length;
		
		session.getAttributes().put("user", user);	

		chatManager.newUser(user);
		
		if(!this.chatManager.chatExists(chatName)) {
			//If the chat does not exist, it is created
			System.out.println("CREATING new chat...");
			Chat chat = chatManager.newChat(chatName, 5, TimeUnit.SECONDS);
			session.getAttributes().put("chat", chat);
			chat.addUser(user);
		}
		else {
			//If the chat already exists, it is modified by adding the new user
			System.out.println("UPDATING existing chat...");
			Chat chat = this.chatManager.getChat(chatName);
			session.getAttributes().put("chat", chat);
			chat.addUser(user);
		}
		
		
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		
		ChatUser user = (ChatUser) session.getAttributes().get("user");
		Chat chat = (Chat) session.getAttributes().get("chat");
		
		if(chat != null) {
			chat.removeUser(user);
			if(!this.chatManager.userAtLeastInOneChat(user)){
				//If the user is not present in any other chat, it is removed from the collection of chat users
				System.out.println("The user " + user.getName() + " is not present in any other chat. Removing user from Chats system... ");
				this.chatManager.removeUserFromChatManager(user);
			}
			if(chat.getUsers().isEmpty()){
				//If the chat has no users, it is closed
				System.out.println("Last user left the room. Closing chat " + chat.getName());
				chat.close();
			}
		}
	}
}

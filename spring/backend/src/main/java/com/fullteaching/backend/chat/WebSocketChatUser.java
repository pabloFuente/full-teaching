package com.fullteaching.backend.chat;

import java.io.IOException;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebSocketChatUser implements ChatUser {

	private static ObjectMapper mapper = new ObjectMapper();

	private WebSocketSession session;
	private String name;
	private String color;

	public WebSocketChatUser(WebSocketSession session, String name, String color) {
		this.session = session;
		this.name = name;
		this.color = color;
	}

	@Override
	public String getName() {
		return name;
	}

	@Override
	public String getColor() {
		return color;
	}

	@Override
	public void newChat(Chat chat) {

		ObjectNode msg = mapper.createObjectNode();
		msg.put("type", "system");
		msg.put("message", "New chat '" + chat.getName() + "'");

		send(msg);
	}

	@Override
	public void chatClosed(Chat chat) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("type", "system");
		msg.put("message", "Chat '" + chat.getName() + "' closed");

		send(msg);
	}

	@Override
	public void newUserInChat(Chat chat, ChatUser user) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("type", "system");
		msg.put("message", "<b>" + user.getName() + "</b> has connected");

		send(msg);
	}

	@Override
	public void userExitedFromChat(Chat chat, ChatUser user) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("type", "system");
		msg.put("message", "<b>" + user.getName() + "</b> exited from chat");

		send(msg);
	}

	@Override
	public void newMessage(Chat chat, ChatUser user, String message) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("name", user.getName());
		msg.put("color", user.getColor());
		msg.put("message", message);

		send(msg);
	}

	private void send(ObjectNode msg) {
		try {
			session.sendMessage(new TextMessage(msg.toString()));
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}

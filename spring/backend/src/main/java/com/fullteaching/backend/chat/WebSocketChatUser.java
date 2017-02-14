package com.fullteaching.backend.chat;

import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
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
		msg.put("message", user.getName() + " has connected");
		send(msg);
		
		this.sendConnectedUsers(chat);
	}

	@Override
	public void userExitedFromChat(Chat chat, ChatUser user) {
		ObjectNode msg = mapper.createObjectNode();
		msg.put("type", "system");
		msg.put("message", user.getName() + " exited from chat");

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
	
	@Override
	public void sendConnectedUsers(Chat chat){
		ObjectNode msgUsers = mapper.createObjectNode();
		msgUsers.put("type", "system-users");
		
		JSONObject jObject = new JSONObject();
		try
		{
		    JSONArray jArray = new JSONArray();
		    for (ChatUser u : chat.getUsers())
		    {
		    	JSONObject userNameJSON = new JSONObject();
				userNameJSON.put("userName", u.getName());
				userNameJSON.put("userColor", u.getColor());
		        jArray.put(userNameJSON);
		    }
		    jObject.put("UserNameList", jArray);
		} catch (JSONException jse) {
		    jse.printStackTrace();
		}
		
		System.out.println(jObject.toString());
		
		msgUsers.put("message", jObject.toString());	
		send(msgUsers);
	}
	
	@Override
	public void sendInterventionPetition(Chat chat, ChatUser user, boolean petition){
		ObjectNode msgIntervention = mapper.createObjectNode();
		msgIntervention.put("type", "system-intervention");
		
		JSONObject jObject = new JSONObject();
		try
		{
			jObject.put("user", user.getName());
			jObject.put("color", user.getColor());
			jObject.put("petition", petition);
		} catch (JSONException jse) {
			jse.printStackTrace();
		}
		System.out.println(jObject.toString());
		
		msgIntervention.put("message", jObject.toString());
		
		send(msgIntervention);
	}
	
	@Override
	public void grantIntervention(Chat chat, ChatUser user, boolean accessGranted){
		ObjectNode msgGrantIntervention = mapper.createObjectNode();
		msgGrantIntervention.put("type", "system-grant-intervention");
		
		JSONObject jObject = new JSONObject();
		try
		{
			jObject.put("user", user.getName());
			jObject.put("accessGranted", accessGranted);
		} catch (JSONException jse) {
			jse.printStackTrace();
		}
		System.out.println(jObject.toString());
		
		msgGrantIntervention.put("message", jObject.toString());
		
		send(msgGrantIntervention);
	}

}

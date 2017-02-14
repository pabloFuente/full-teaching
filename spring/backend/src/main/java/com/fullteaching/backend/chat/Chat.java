package com.fullteaching.backend.chat;

import java.util.Collection;
import java.util.Collections;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.function.Consumer;

public class Chat {

	private ChatManager chatManager;
	private String name;
	private String teacher;
	
	private ConcurrentMap<String, ChatUser> users = new ConcurrentHashMap<>();

	private ExecutorService executor;

	public Chat(ChatManager chatManager, String name, ExecutorService executor, String teacherName) {
		this.chatManager = chatManager;
		this.name = name;
		this.executor = executor;
		this.teacher = teacherName;
	}

	public void addUser(ChatUser user) {
		users.put(user.getName(), user);
		forEachUser(u -> {
			if (u != user) { // For all previous users
				u.newUserInChat(this, user);
			} else { // Just for the new user
				u.sendConnectedUsers(this);
			}
		});
	}

	public void removeUser(ChatUser user) {
		users.remove(user.getName());
		forEachUser(u -> {
				u.userExitedFromChat(this, user);
				if (u != user) { // For all previous users
					u.sendConnectedUsers(this);
				}
				if (u.getName().equals(this.teacher)){ // For the teacher
					// Cancel possible remaining intervention petition from removed user 
					users.get(this.teacher).sendInterventionPetition(this, user, false);
				}
			}
		);
	}

	public void close() {
		this.chatManager.closeChat(this);
	}

	public void sendMessage(ChatUser user, String message) {
		forEachUser(u -> u.newMessage(this, user, message));
	}
	
	public void requestIntervention(ChatUser user, boolean petition){
		users.get(this.teacher).sendInterventionPetition(this, user, petition);
	}
	
	public void grantIntervention(String studentName, boolean accessGranted) {
		ChatUser user = users.get(studentName);
		forEachUser(u -> u.grantIntervention(this, user, accessGranted));
	}

	private void forEachUser(Consumer<ChatUser> userAction) {
		users.values().stream().forEach(u -> executor.submit(() -> {
			synchronized (u) {
				userAction.accept(u);	
			}			
		}));
	}

	public Collection<ChatUser> getUsers() {
		return Collections.unmodifiableCollection(users.values());
	}

	public String getName() {
		return name;
	}

	public ChatUser getUser(String name) {
		return users.get(name);
	}

}

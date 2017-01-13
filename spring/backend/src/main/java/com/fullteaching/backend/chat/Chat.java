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
	
	private ConcurrentMap<String, ChatUser> users = new ConcurrentHashMap<>();

	private ExecutorService executor;

	public Chat(ChatManager chatManager, String name, ExecutorService executor) {
		this.chatManager = chatManager;
		this.name = name;
		this.executor = executor;
	}

	public void addUser(ChatUser user) {
		users.put(user.getName(), user);
		forEachUser(u -> {
			if (u != user) {
				u.newUserInChat(this, user);
			}
		});
	}

	public void removeUser(ChatUser user) {
		users.remove(user.getName());
		forEachUser(u -> u.userExitedFromChat(this, user));
	}

	public void close() {
		this.chatManager.closeChat(this);
	}

	public void sendMessage(ChatUser user, String message) {
		forEachUser(u -> u.newMessage(this, user, message));
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

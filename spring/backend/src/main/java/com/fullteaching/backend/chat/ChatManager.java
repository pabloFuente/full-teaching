package com.fullteaching.backend.chat;

import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Consumer;

public class ChatManager {

	private static final int STATISTICS_INTERVAL = 10;

	private ConcurrentMap<String, Chat> chats = new ConcurrentHashMap<>();
	private ConcurrentMap<String, ChatUser> users = new ConcurrentHashMap<>();

	private ExecutorService executor = Executors.newFixedThreadPool(20);

	private ScheduledExecutorService scheduledExecutor = Executors.newScheduledThreadPool(1);

	private Semaphore numChatsSem;

	public ChatManager(int maxChats) {
		this(maxChats, new StatisticCalculator());
	}

	public ChatManager(int maxChats, StatisticCalculator calculator) {
		numChatsSem = new Semaphore(maxChats);
		scheduledExecutor.scheduleAtFixedRate(() -> calculator.calculateStatistics(this),
				STATISTICS_INTERVAL, STATISTICS_INTERVAL, TimeUnit.SECONDS);
	}

	public void newUser(ChatUser user) {
		System.out.println("(ChatManager) newUser");
		ChatUser oldUser = users.putIfAbsent(user.getName(), user);
		if (oldUser != null) {
			System.out.println("The user is already in at least one chat!");
			/*throw new IllegalArgumentException("There is already a user with name \'"
					+ user.getName() + "\'");*/
		}
	}

	public Chat newChat(String name, long timeout, TimeUnit unit, String teacherName) throws InterruptedException,
			TimeoutException {
		
		System.out.println("(ChatManager) newChat");

		if (!numChatsSem.tryAcquire(timeout, unit)) {
			System.out.println("No capacity");
			throw new TimeoutException("There is no enough capacity to create a new chat");
		}
		
		System.out.println("There are still " + numChatsSem.availablePermits() + " permits for new chats");
		
		Chat oldChat = chats.computeIfAbsent(name, n -> new Chat(this, name, executor, teacherName));
		if (oldChat != null) {
			return oldChat;
		}

		Chat newChat = chats.get(name);
		forEachUser(u -> u.newChat(newChat));

		return newChat;
	}

	public void closeChat(Chat chat) {
		System.out.println("(ChatManager) Closing chat " + chat.getName());
		
		Chat removedChat = chats.remove(chat.getName());
		if (removedChat == null) {
			throw new IllegalArgumentException("Trying to remove an unknown chat with name \'"
					+ chat.getName() + "\'");
		}

		forEachUser(u -> u.chatClosed(removedChat));
		
		System.out.println("Releasing a permit...");
		
		numChatsSem.release();
		
		System.out.println("There are still " + chats.size() + " chats opened: ");
		for(Chat ch : this.getChats()){
			System.out.println("  - " + ch.getName());
		}
		
	}

	public Collection<Chat> getChats() {
		return Collections.unmodifiableCollection(chats.values());
	}

	public Chat getChat(String chatName) {
		return chats.get(chatName);
	}

	public Collection<ChatUser> getUsers() {
		return Collections.unmodifiableCollection(users.values());
	}

	public ChatUser getUser(String userName) {
		return users.get(userName);
	}
	
	
	public ChatUser removeUserFromChatManager(ChatUser u){
		return this.users.remove(u.getName());
	}
	
	public boolean chatExists(String chatName){
		return (this.chats.get(chatName) != null);
	}
	
	public boolean userAtLeastInOneChat(ChatUser u){
		boolean present = false;
		Iterator<Chat> i = this.chats.values().iterator();
		while(i.hasNext() && !present){
			Chat c = (Chat) i.next();
			present = (c.getUser(u.getName()) != null);
		}
		return present;
	}
	
	

	private void forEachUser(Consumer<ChatUser> userAction) {
		users.values().stream().forEach(u -> {
			executor.submit(() -> {
				synchronized (u) {
					userAction.accept(u);
				}
			});
		});
	}

	public void close() {
		this.executor.shutdown();
		this.scheduledExecutor.shutdown();
	}

}

package com.fullteaching.backend.chat;

import java.util.OptionalDouble;

public class StatisticCalculator {

	public void calculateStatistics(ChatManager chatManager) {
		
		OptionalDouble avg = chatManager.getChats().parallelStream().mapToDouble(c -> c.getUsers().size()).average();
		
		if(avg.isPresent()){
			//System.out.println("Avg number of users per chat: "+avg.getAsDouble());
		}
	}
}

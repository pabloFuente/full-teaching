package com.fullteaching.backend.chat;

import java.util.OptionalDouble;

public class StatisticCalculator {

	public void calculateStatistics(ChatManager chatManager) {
		
		OptionalDouble avg = chatManager.getChats().parallelStream().mapToDouble(c -> c.getUsers().size()).average();
		
		if(avg.isPresent()){
			System.out.println("Avg number of users per chat: "+avg.getAsDouble());
		}
	}

	//Número medio de usuarios de chat cada 10 s. 
	//Número medio "avanzado" ponderando tiempo de cada usuarios.
	//La forma más básica de paralelizar es calcular por chat de forma concurrente y luego "fusionar". 
	
	// Crear una tarea por Chat, ejecutar el método en cada chat y luego fusionar de forma secuencial.
	// Forzar a que el algoritmo sea implementado en paralelo de forma "manual".
}

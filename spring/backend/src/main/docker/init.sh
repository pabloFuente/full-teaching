#!/bin/bash

sleep 45

java -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=container -jar /app.jar

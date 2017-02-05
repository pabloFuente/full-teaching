#!/bin/sh
cd spring/backend
mvn clean package
java -jar target/full-teaching-0.5-SNAPSHOT.war

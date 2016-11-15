#!/bin/sh
cd spring/backend
mvn package
java -jar target/backend-0.0.1-SNAPSHOT.jar

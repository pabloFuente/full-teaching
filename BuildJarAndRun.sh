#!/bin/sh
cd spring/backend
mvn package
java -jar target/full-teaching-0.5-SNAPSHOT.jar

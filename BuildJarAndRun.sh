#!/bin/sh
cd spring/backend
mvn package
java -jar target/full-teaching.jar

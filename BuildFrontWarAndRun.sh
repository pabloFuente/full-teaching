#!/bin/sh
cd angular-cli-project
ng build --output-path ./../spring/backend/src/main/resources/static
cd ../spring/backend
mvn clean package
java -jar target/full-teaching-0.5-SNAPSHOT.war

#!/bin/sh
cd angular-cli-project
ng build --output-path ./../spring/backend/src/main/resources/static
cd ../spring/backend
mvn package
java -jar target/backend-0.0.1-SNAPSHOT.jar

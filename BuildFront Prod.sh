#!/bin/sh
cd angular-cli-project
ng build --env=prod --output-path ./../spring/backend/src/main/resources/static

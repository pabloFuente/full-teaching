# FullTeaching

## Quick start guide

### Prerequisites
To run the application is necessary:
  - **Java 8**

    *Check version*:

        $ java -version

     *Install*:

        $ sudo add-apt-repository ppa:webupd8team/java
        $ sudo apt-get update
        $ sudo apt-get install oracle-java8-installer

  - **Angular-cli** ( which requires  Node.js > 4.x.x  and  npm > 3.x.x )

    *Check versions*:

        $ node -v
        $ npm -v
        $ ng --version

     *Install*:

        $ sudo apt-get install nodejs
        $ sudo apt-get install npm
        $ npm install -g angular-cli

  - **Maven**

    *Check version*:

        $ mvn -v

    *Install*:

        $ sudo apt-get install maven

  - **MySQL**

    *Check version*:

        $ mysql --version

    *Install*:

        $ sudo apt-get update
        $ sudo apt-get install mysql-server
        $ sudo mysql_secure_installation
        $ sudo mysql_install_db

### Running FullTeaching

Just execute the following commands:

  First of all, it is necessary to create a schema for MySQL:

        $ mysql -u root -p
        $ CREATE DATABASE full_teaching;
        $ exit

  Then we can build and run the project:

        $ git clone https://github.com/pabloFuente/full-teaching.git
        $ cd ./full-teaching/angular-cli-project/
        $ npm install
        $ cd ../
        $ ./BuildFrontJarAndRun.sh

This clones the project in your working directory, installs dependencies with `npm install` and executes the `BuildFrontJarAndRun.sh` script.

The script `BuildFrontJarAndRun.sh` builds the FrontEnd with angular-cli, copies all generated files to the Backend `static` folder, builds and generates the jar with maven and runs the jar file.

Go to `http://localhost:5000/` and there you have it!


## :heavy_exclamation_mark: **IMPORTANT**:

  - Before executing the script to build and run the app, it is necessary to change the following properties of `application.properties` file to match your credentials for MySQL:

        spring.datasource.username=YOUR_USERNAME
        spring.datasource.password=YOUR_PASS

  - You may have to change permissions in order to execute the scripts.

*These instructions have been tested for Ubuntu 14.04*

[![][ElasTest Logo]][ElasTest]

Copyright © 2017-2019 [ElasTest]. Licensed under [Apache 2.0 License].

FullTeaching - Demonstrator for ElasTest - WebRTC
==============================

What is ElasTest
-----------------

This repository is part of [ElasTest], which is an open source elastic platform
aimed to simplify end-to-end testing. ElasTest platform is based on three
principles: i) Test orchestration: Combining intelligently testing units for
creating a more complete test suite following the “divide and conquer” principle.
ii) Instrumentation and monitoring: Customizing the SuT (Subject under Test)
infrastructure so that it reproduces real-world operational behavior and allowing
to gather relevant information during testing. iii) Test recommendation: Using machine
learning and cognitive computing for recommending testing actions and providing
testers with friendly interactive facilities for decision taking.

What is FullTeaching?
----------------
FullTeaching is an educational web application to make online classes easy for teachers as well as students. It has been developed by Pablo Fuente under [Apache 2.0 License]. You can find the complete description of the project in the original repository https://github.com/pabloFuente/full-teaching. 

Why has been selected as a Demonstrator for the ElasTest project?
----------------
Fullteaching has been selected as a Demonstrator for the ElasTest project because of it usage of [OpenVidu] and completeness of its features.



# Quick start guide

## How to execute a demo FullTeaching service (Docker)

To get FullTeaching working in the easiest way, you just have to download the file above `docker-compose.yml` and run `docker-compose up` in its directory. This will pull all the necessary images from DockerHub and will execute everything (it will take one minute after the pull ends). Go to `http://localhost:5000/` and there you have it!

You will need some user data to test the features. These are the default users for the demo:
- Email: `teacher@gmail.com`   Pass: `pass`  (Teacher account)
- Email: `student1@gmail.com`  Pass: `pass`  (Student account) 
- Email: `student2@gmail.com`  Pass: `pass`  (Student account)


## How to develop FullTeaching

To get a full development version of the app just execute the following commands:


### Prerequisites

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

### Installation and execution

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

Go to `http://localhost:5000/` and there you have it! Every time you modify the Front or Back, you can just execute `BuildFrontJarAndRun.sh` and all the changes will be applied.


### :heavy_exclamation_mark: **IMPORTANT**:

  - Before executing the script to build and run the app, it is necessary to change the following properties of `application.properties` file to match your credentials for MySQL:

        spring.datasource.username=YOUR_USERNAME
        spring.datasource.password=YOUR_PASS

  - You may have to change permissions in order to execute the scripts.

*These instructions have been tested for Ubuntu 14.04*

[Apache 2.0 License]: http://www.apache.org/licenses/LICENSE-2.0
[ElasTest]: http://elastest.io/
[ElasTest Logo]: http://elastest.io/images/logos_elastest/elastest-logo-gray-small.png
[ElasTest Twitter]: https://twitter.com/elastestio
[GitHub ElasTest Group]: https://github.com/elastest
[OpenVidu]: http://openvidu.io/

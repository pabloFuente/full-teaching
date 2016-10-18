import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend, options) => {
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {

      function getElementsByCourseID(objArray, a): any[] {
        return objArray.filter(function( obj ) {return (obj.course.toString() === a.toString());});
      }

      function getElementsByCourseID2(objArray, a): any[] {
        return objArray.filter(function( obj ) {return (obj.courseID.toString() === a.toString());});
      }

      let teacherUser = { email: 'teacher@gmail.com', pass: 't', name: 'Techer Cheater', role: 1, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png' };
      let studentUser = { email: 'student@gmail.com', pass: 's', name: 'Student Imprudent', role: 0, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png'};

      let session1 = { id: 0, courseID: 0, title: "Session 1: Introduction to Web", description: 'This is a nice description about this session.', date: new Date("October 13, 2016 11:30:00")};
      let session2 = { id: 1, courseID: 0, title: "Examples", description: 'This is a nice description about this session.', date: new Date("November 5, 2016 12:30:00")};
      let session3 = { id: 2, courseID: 0, title: "Project configuration", description: 'This is a nice description about this session.', date: new Date("October 22, 2016 17:45:00")};
      let session4 = { id: 3, courseID: 1, title: "Session 3: New technologies", description: 'This is a nice description about this session.', date: new Date("November 1, 2016 11:30:00")};
      let session5 = { id: 4, courseID: 1, title: "Session 2: Database integration", description: 'This is a nice description about this session.', date: new Date("October 15, 2016 13:00:00")};

      let sessions = [session1, session2, session3, session4, session5];

      let course1 = { id: 0, title: "FullStack course", teacher: teacherUser, image: ''};
      let course2 = { id: 1, title: "Test-Driven Development ", teacher: teacherUser, image: ''};

      let courses = [course1, course2];

      let comment2 = { id: 2, user: studentUser, message: "This is comment 2 of entry 1 of forum of session 1.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment1 = { id: 1, user: teacherUser, message: "This is comment 1 of entry 1 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment2]};
      let comment3 = { id: 3, user: teacherUser, message: "This is comment 3 of entry 1 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment5 = { id: 5, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment4 = { id: 4, user: studentUser, message: "This is comment 1 of entry 2 of forum of session 1. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?", date: new Date("October 13, 2016 11:30:00"), replies: [comment5]};

      let comment8 = { id: 8, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment9 = { id: 9, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment7 = { id: 7, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment8]};
      let comment6 = { id: 6, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment7, comment9]};
      let comment10 = { id: 10, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment11 = { id: 11, user: studentUser, message: "This is comment 1 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment12 = { id: 12, user: studentUser, message: "This is comment 2 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment13 = { id: 13, user: studentUser, message: "This is comment 3 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment14 = { id: 14, user: studentUser, message: "This is comment 1 of entry 1 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment18 = { id: 18, user: studentUser, message: "This is comment 4 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment17 = { id: 17, user: teacherUser, message: "This is comment 3 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: [comment18]};
      let comment15 = { id: 15, user: teacherUser, message: "This is comment 1 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: [comment17]};
      let comment16 = { id: 16, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment19 = { id: 19, user: teacherUser, message: "This is comment 1 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment20 = { id: 20, user: teacherUser, message: "This is comment 2 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment21 = { id: 21, user: studentUser, message: "This is comment 3 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment24 = { id: 24, user: studentUser, message: "This is comment 3 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment23 = { id: 23, user: teacherUser, message: "This is comment 2 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment24]};
      let comment22 = { id: 22, user: studentUser, message: "This is comment 1 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment23]};


      let comment25 = { id: 25, user: teacherUser, message: "This is comment 1 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment27 = { id: 27, user: studentUser, message: "This is comment 3 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment26 = { id: 26, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment27]};

      let comment29 = { id: 29, user: studentUser, message: "This is comment 2 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment28 = { id: 28, user: studentUser, message: "This is comment 1 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment29]};
      let comment30 = { id: 30, user: studentUser, message: "This is comment 3 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment31 = { id: 31, user: teacherUser, message: "This is comment 1 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment33 = { id: 33, user: studentUser, message: "This is comment 3 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment32 = { id: 32, user: teacherUser, message: "This is comment 2 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment33]};


      let comments1 = [comment1, comment3];

      let comments2 = [comment4];

      let comments3 = [comment6, comment10];

      let comments4 = [comment11, comment12, comment13];

      let comments5 = [comment14];

      let comments6 = [comment15, comment16];

      let comments7 = [comment19, comment20, comment21];

      let comments8 = [comment22];

      let comments9 = [comment25, comment26];

      let comments10 = [comment28, comment30];

      let comments11 = [comment31, comment32];

      let comments12 = [];


      let entries1 = [
        { id: 0, forum: 0, user: studentUser, title: "This is entry 1 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments1 },
        { id: 1, forum: 0, user: teacherUser, title: "This is entry 2 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments2 },
        { id: 2, forum: 0, user: studentUser, title: "This is entry 3 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments3 },
        { id: 3, forum: 0, user: studentUser, title: "This is entry 4 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments4 },
      ];

      let entries2 = [
        { id: 4, forum: 1, user: teacherUser, title: "This is entry 1 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments5 },
        { id: 5, forum: 1, user: teacherUser, title: "This is entry 2 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments6 },
        { id: 6, forum: 1, user: studentUser, title: "This is entry 3 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments7 },
      ];

      let forums = [
        { id: 0, course: 0, activated: true, entries:  entries1 } ,
        { id: 1, course: 1, activated: false, entries:  entries2 },
      ];

      let file1 = { id: 1, course: 0, link: "www.myFileLink.com", name: "fileAPrettyLongName", type: 1 };
      let file2 = { id: 2, course: 0, link: "www.myFileLink.com", name: "fileB", type: 0 };
      let file3 = { id: 3, course: 0, link: "www.myFileLink.com", name: "fileCPrettyLongName", type: 0 };
      let file4 = { id: 4, course: 0, link: "www.myFileLink.com", name: "fileD", type: 1 };
      let file5 = { id: 5, course: 0, link: "www.myFileLink.com", name: "fileEPrettyLongName", type: 2 };
      let file6 = { id: 6, course: 0, link: "www.myFileLink.com", name: "fileF", type: 0 };
      let file7 = { id: 10, course: 0, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 2 };
      let file8 = { id: 11, course: 0, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 0 };
      let file9 = { id: 12, course: 0, link: "www.myFileLink.com", name: "fileF", type: 0 };
      let file10 = { id: 13, course: 0, link: "www.myFileLink.com", name: "fileF", type: 0 };
      let file11 = { id: 14, course: 0, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 1 };
      let file12 = { id: 15, course: 0, link: "www.myFileLink.com", name: "fileF", type: 0 };
      let file13 = { id: 16, course: 0, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 1 };
      let file14 = { id: 17, course: 1, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 1 };
      let file15 = { id: 18, course: 1, link: "www.myFileLink.com", name: "fileF", type: 1 };
      let file16 = { id: 19, course: 1, link: "www.myFileLink.com", name: "fileF", type: 1 };
      let file17 = { id: 20, course: 1, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 0 };
      let file18 = { id: 21, course: 1, link: "www.myFileLink.com", name: "fileF", type: 2 };
      let file19 = { id: 22, course: 1, link: "www.myFileLink.com", name: "fileF", type: 2 };
      let file20 = { id: 23, course: 1, link: "www.myFileLink.com", name: "fileFPrettyLongName", type: 0 };
      let file21 = { id: 24, course: 1, link: "www.myFileLink.com", name: "fileF", type: 1 };

      let fileGroup1 = { title: "Take a look if you have plenty of time", files: [file1, file2, file3], fileGroups: []};
      let fileGroup2 = { title: "Optional tasks", files: [file4, file5], fileGroups: [fileGroup1]};
      let fileGroup3 = { title: "Lesson 1 - Important files", files: [file6, file7, file8, file9, file10], fileGroups: []};
      let fileGroup4 = { title: "Optional tasks", files: [file11, file12, file13], fileGroups: []};
      let fileGroup6 = { title: "Optional tasks", files: [file17, file18, file19, file20, file21], fileGroups: []};
      let fileGroup5 = { title: "Real Examples for Lesson 2", files: [file14, file15, file16], fileGroups: [fileGroup6]};

      let fileGroupsA = {course: 0, fileGroups: [fileGroup2, fileGroup3]};
      let fileGroupsB = {course: 1, fileGroups: [fileGroup4, fileGroup5]};

      let fileGroups = [fileGroupsA, fileGroupsB];

      let attenders = [
        { user: teacherUser },
        { user: studentUser },
      ]

      // wrap in timeout to simulate server api call
      setTimeout(() => {

        // FAKE AUTHENTICATE API ENDPOINT
        if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request
          let params = JSON.parse(connection.request.getBody());

          // check user credentials and return fake jwt token if valid
          if (params.email === teacherUser.email && params.pass === teacherUser.pass) {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: { user: teacherUser, token: 'fake-jwt-token-teacher' } })
            ));
          }
          else if (params.email === studentUser.email && params.pass === studentUser.pass){
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: { user: studentUser, token: 'fake-jwt-token-student' } })
            ));
          }
          else {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200 })
            ));
          }
        }

        // FAKE LESSONS API ENDPOINT
        if (connection.request.url.endsWith('/api/courses') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return sessions if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: courses })
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 401 })
            ));
          }
        }


        // FAKE LESSON-DETAILS API ENDPOINT
        if (connection.request.url.endsWith('course-details/', 20) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return sessions if valid, this security is implemented server side
          // in a real application
          let url = connection.request.url;
          let last = url.substring(url.lastIndexOf("/") + 1, url.length);
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: {course: courses.filter(function( c ) {return c.id === +last;})[0], sessions: getElementsByCourseID2(sessions, last), forum: getElementsByCourseID(forums, last)[0], files: getElementsByCourseID(fileGroups, last), attenders: attenders} })
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 401 })
            ));
          }
        }


        // FAKE LESSONS API ENDPOINT
        if (connection.request.url.endsWith('/api/sessions') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return sessions if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: sessions })
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 401 })
            ));
          }
        }

      }, 500);

    });

    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions]
};

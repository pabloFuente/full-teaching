import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend, options) => {
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {

      function getElementBySessionID(objArray, a): any[] {
        return objArray.filter(function( obj ) {return (obj.session.toString() === a.toString());});
      }

      let teacherUser = { email: 'teacher@gmail.com', pass: 't', name: 'Techer Cheater', role: 1, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png' };
      let studentUser = { email: 'student@gmail.com', pass: 's', name: 'Student Imprudent', role: 0, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png'};

      let session1 = { IDSession: 0, title: "Session 1: Introduction to Web", description: 'This is a nice description about this session.', date: new Date("October 13, 2016 11:30:00"), user: teacherUser, image: '' };
      let session2 = { IDSession: 1, title: "Examples", description: 'This is a nice description about this session.', date: new Date("November 5, 2016 12:30:00"), user: teacherUser, image: '' };
      let session3 = { IDSession: 2, title: "Project configuration", description: 'This is a nice description about this session.', date: new Date("October 22, 2016 17:45:00"), user: teacherUser, image: '' };
      let session4 = { IDSession: 3, title: "Session 3: New technologies", description: 'This is a nice description about this session.', date: new Date("November 1, 2016 11:30:00"), user: teacherUser, image: '' };
      let session5 = { IDSession: 4, title: "Session 2: Database integration", description: 'This is a nice description about this session.', date: new Date("October 15, 2016 13:00:00"), user: teacherUser, image: '' };

      let sessions = [session1, session2, session3, session4, session5];

      let comment2 = { IDComment: 2, user: studentUser, message: "This is comment 2 of entry 1 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment1 = { IDComment: 1, user: teacherUser, message: "This is comment 1 of entry 1 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment2]};
      let comment3 = { IDComment: 3, user: teacherUser, message: "This is comment 3 of entry 1 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment5 = { IDComment: 5, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment4 = { IDComment: 4, user: studentUser, message: "This is comment 1 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment5]};

      let comment8 = { IDComment: 8, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment9 = { IDComment: 9, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment7 = { IDComment: 7, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment8]};
      let comment6 = { IDComment: 6, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: [comment7, comment9]};
      let comment10 = { IDComment: 10, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment11 = { IDComment: 11, user: studentUser, message: "This is comment 1 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment12 = { IDComment: 12, user: studentUser, message: "This is comment 2 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment13 = { IDComment: 13, user: studentUser, message: "This is comment 3 of entry 4 of forum of session 1", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment14 = { IDComment: 14, user: studentUser, message: "This is comment 1 of entry 1 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment18 = { IDComment: 18, user: studentUser, message: "This is comment 4 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment17 = { IDComment: 17, user: teacherUser, message: "This is comment 3 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: [comment18]};
      let comment15 = { IDComment: 15, user: teacherUser, message: "This is comment 1 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: [comment17]};
      let comment16 = { IDComment: 16, user: teacherUser, message: "This is comment 2 of entry 2 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment19 = { IDComment: 19, user: teacherUser, message: "This is comment 1 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment20 = { IDComment: 20, user: teacherUser, message: "This is comment 2 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment21 = { IDComment: 21, user: studentUser, message: "This is comment 3 of entry 3 of forum of session 2", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment24 = { IDComment: 24, user: studentUser, message: "This is comment 3 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment23 = { IDComment: 23, user: teacherUser, message: "This is comment 2 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment24]};
      let comment22 = { IDComment: 22, user: studentUser, message: "This is comment 1 of entry 1 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment23]};


      let comment25 = { IDComment: 25, user: teacherUser, message: "This is comment 1 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment27 = { IDComment: 27, user: studentUser, message: "This is comment 3 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment26 = { IDComment: 26, user: studentUser, message: "This is comment 2 of entry 2 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment27]};

      let comment29 = { IDComment: 29, user: studentUser, message: "This is comment 2 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment28 = { IDComment: 28, user: studentUser, message: "This is comment 1 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment29]};
      let comment30 = { IDComment: 30, user: studentUser, message: "This is comment 3 of entry 3 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};

      let comment31 = { IDComment: 31, user: teacherUser, message: "This is comment 1 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment33 = { IDComment: 33, user: studentUser, message: "This is comment 3 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: []};
      let comment32 = { IDComment: 32, user: teacherUser, message: "This is comment 2 of entry 4 of forum of session 3", date: new Date("October 13, 2016 11:30:00"), replies: [comment33]};


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
        { IDEntry: 0, forum: 0, user: studentUser, title: "This is entry 1 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments1 },
        { IDEntry: 1, forum: 0, user: teacherUser, title: "This is entry 2 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments2 },
        { IDEntry: 2, forum: 0, user: studentUser, title: "This is entry 3 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments3 },
        { IDEntry: 3, forum: 0, user: studentUser, title: "This is entry 4 of the forum of the session 1", date: new Date("October 13, 2016 11:30:00"), comments: comments4 },
      ];

      let entries2 = [
        { IDEntry: 4, forum: 1, user: teacherUser, title: "This is entry 1 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments5 },
        { IDEntry: 5, forum: 1, user: teacherUser, title: "This is entry 2 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments6 },
        { IDEntry: 6, forum: 1, user: studentUser, title: "This is entry 3 of the forum of the session 2", date: new Date("October 13, 2016 11:30:00"), comments: comments7 },
      ];

      let entries3 = [
        { IDEntry: 7, forum: 2, user: teacherUser, title: "This is entry 1 of the forum of the session 3", date: new Date("October 13, 2016 11:30:00"), comments: comments8 },
        { IDEntry: 8, forum: 2, user: studentUser, title: "This is entry 2 of the forum of the session 3", date: new Date("October 13, 2016 11:30:00"), comments: comments9 },
        { IDEntry: 9, forum: 2, user: teacherUser, title: "This is entry 3 of the forum of the session 3", date: new Date("October 13, 2016 11:30:00"), comments: comments10 },
        { IDEntry: 10, forum: 2, user: studentUser, title: "This is entry 4 of the forum of the session 3", date: new Date("October 13, 2016 11:30:00"), comments: comments11 },
      ];

      let entries4 = [
        { IDEntry: 11, forum: 3, user: teacherUser, title: "This is entry 1 of the forum of the session 4", date: new Date("October 13, 2016 11:30:00"), comments: comments12 },
      ];

      let forums = [
        { IDForum: 0, session: 0, activated: true, entries:  entries1 } ,
        { IDForum: 1, session: 1, activated: true, entries:  entries2 },
        { IDForum: 2, session: 2, activated: true, entries:  entries3 },
        { IDForum: 3, session: 3, activated: true, entries:  entries4 },
        { IDForum: 4, session: 4, activated: false, entries: {}       },
      ];



      let files = [
        { IDFile: 1, session: 0, source: "fileAPrettyLongName.src" },
        { IDFile: 2, session: 0, source: "fileB.src" },
        { IDFile: 3, session: 1, source: "fileCPrettyLongName.src" },
        { IDFile: 4, session: 3, source: "fileD.src" },
        { IDFile: 5, session: 3, source: "fileEPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
        { IDFile: 6, session: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, session: 4, source: "fileF.src" },
      ]

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

        // FAKE LESSON-DETAILS API ENDPOINT
        if (connection.request.url.endsWith('course-details/', 20) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return sessions if valid, this security is implemented server side
          // in a real application
          let url = connection.request.url;
          let last = url.substring(url.lastIndexOf("/") + 1, url.length);
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: {forum: getElementBySessionID(forums, last)[0], files: getElementBySessionID(files, last), attenders: attenders} })
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

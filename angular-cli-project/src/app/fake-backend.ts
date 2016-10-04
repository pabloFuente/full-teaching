import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend, options) => {
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {

      let teacherUser = { email: 'teacher@gmail.com', pass: 't', name: 'Techer Cheater', role: 1, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png' };
      let studentUser = { email: 'student@gmail.com', pass: 's', name: 'Student Imprudent', role: 0, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png'};

      let lessons = [
        { IDlesson: 1, title: "Lesson 1: Introduction to Web", description: 'This is a nice description about this lesson.', date: new Date("October 13, 2016 11:30:00"), user: teacherUser, image: '' },
        { IDlesson: 2, title: "Examples", description: 'This is a nice description about this lesson.', date: new Date("November 5, 2016 12:30:00"), user: teacherUser, image: '' },
        { IDlesson: 3, title: "Project configuration", description: 'This is a nice description about this lesson.', date: new Date("October 22, 2016 17:45:00"), user: teacherUser, image: '' },
        { IDlesson: 4, title: "Lesson 3: New technologies", description: 'This is a nice description about this lesson.', date: new Date("November 1, 2016 11:30:00"), user: teacherUser, image: '' },
        { IDlesson: 5, title: "Lesson 2: Database integration", description: 'This is a nice description about this lesson.', date: new Date("October 15, 2016 13:00:00"), user: teacherUser, image: '' },
      ];

      let forums = [
        { entry: "ENTRY 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { entry: "ENTRY 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { entry: "ENTRY 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { entry: "ENTRY 4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { entry: "ENTRY 5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" }
      ]

      let files = [
        { source: "file1.src" },
        { source: "file2.src" },
        { source: "file3.src" }
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
              new ResponseOptions({ status: 200, body: { token: 'fake-jwt-token-teacher' } })
            ));
          }
          else if (params.email === studentUser.email && params.pass === studentUser.pass){
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: { token: 'fake-jwt-token-student' } })
            ));
          }
          else {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200 })
            ));
          }
        }

        // FAKE LESSONS API ENDPOINT
        if (connection.request.url.endsWith('/api/lessons') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return lessons if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: lessons })
            ));
          } else {
            // return 401 not authorised if token is null or invalid
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 401 })
            ));
          }
        }

        // FAKE LESSON-DETAILS API ENDPOINT
        if (connection.request.url.endsWith('lesson-details/', 20) && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return lessons if valid, this security is implemented server side
          // in a real application
          let url = connection.request.url;
          let last = url.substring(url.lastIndexOf("/") + 1, url.length);
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token-teacher' || 'Bearer fake-jwt-token-student') {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: {lesson: lessons[last], forum: forums[last], files: files, attenders: attenders} })
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

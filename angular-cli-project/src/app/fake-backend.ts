import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend, options) => {
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {

      function getElementByLessonID(objArray, a): any[] {
        return objArray.filter(function( obj ) {return (obj.lesson.toString() === a.toString());});
      }

      let teacherUser = { email: 'teacher@gmail.com', pass: 't', name: 'Techer Cheater', role: 1, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png' };
      let studentUser = { email: 'student@gmail.com', pass: 's', name: 'Student Imprudent', role: 0, picture: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/b666f811889067.562541eff3013.png'};

      let lesson1 = { IDLesson: 0, title: "Lesson 1: Introduction to Web", description: 'This is a nice description about this lesson.', date: new Date("October 13, 2016 11:30:00"), user: teacherUser, image: '' };
      let lesson2 = { IDLesson: 0, title: "Examples", description: 'This is a nice description about this lesson.', date: new Date("November 5, 2016 12:30:00"), user: teacherUser, image: '' };
      let lesson3 = { IDLesson: 0, title: "Project configuration", description: 'This is a nice description about this lesson.', date: new Date("October 22, 2016 17:45:00"), user: teacherUser, image: '' };
      let lesson4 = { IDLesson: 0, title: "Lesson 3: New technologies", description: 'This is a nice description about this lesson.', date: new Date("November 1, 2016 11:30:00"), user: teacherUser, image: '' };
      let lesson5 = { IDLesson: 0, title: "Lesson 2: Database integration", description: 'This is a nice description about this lesson.', date: new Date("October 15, 2016 13:00:00"), user: teacherUser, image: '' };

      let lessons = [lesson1, lesson2, lesson3, lesson4, lesson5];

      let forums = [
        { lesson: 0, entry: "ENTRY 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { lesson: 1, entry: "ENTRY 2: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { lesson: 2, entry: "ENTRY 3: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { lesson: 3, entry: "ENTRY 4: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" },
        { lesson: 4, entry: "ENTRY 5: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam" }
      ]

      let files = [
        { IDFile: 1, lesson: 0, source: "fileAPrettyLongName.src" },
        { IDFile: 2, lesson: 0, source: "fileB.src" },
        { IDFile: 3, lesson: 1, source: "fileCPrettyLongName.src" },
        { IDFile: 4, lesson: 3, source: "fileD.src" },
        { IDFile: 5, lesson: 3, source: "fileEPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
        { IDFile: 6, lesson: 4, source: "fileFPrettyLongName.src" },
        { IDFile: 6, lesson: 4, source: "fileF.src" },
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
              new ResponseOptions({ status: 200, body: {forum: getElementByLessonID(forums, last)[0], files: getElementByLessonID(files, last), attenders: attenders} })
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

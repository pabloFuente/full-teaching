import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: Http,
  useFactory: (backend, options) => {
    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
      let adminUser = { email: 'admin@admin.com', pass: 'admin' };

      let lessons = [
        { title: "Lesson 1: Introduction to Web", description: 'This is a nice description about this lesson.', date: new Date("October 13, 2016 11:30:00") },
        { title: "Examples", description: 'This is a nice description about this lesson.', date: new Date("November 5, 2016 12:30:00") },
        { title: "Project configuration", description: 'This is a nice description about this lesson.', date: new Date("October 22, 2016 17:45:00") },
        { title: "Lesson 3: New technologies", description: 'This is a nice description about this lesson.', date: new Date("November 1, 2016 11:30:00") },
        { title: "Lesson 2: Database integration", description: 'This is a nice description about this lesson.', date: new Date("October 15, 2016 13:00:00") },
      ];

      // wrap in timeout to simulate server api call
      setTimeout(() => {

        // fake authenticate api end point
        if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
          // get parameters from post request
          let params = JSON.parse(connection.request.getBody());

          // check user credentials and return fake jwt token if valid
          if (params.email === adminUser.email && params.pass === adminUser.pass) {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200, body: { token: 'fake-jwt-token' } })
            ));
          } else {
            connection.mockRespond(new Response(
              new ResponseOptions({ status: 200 })
            ));
          }
        }

        // fake lessons api end point
        if (connection.request.url.endsWith('/api/lessons') && connection.request.method === RequestMethod.Get) {
          // check for fake auth token in header and return lessons if valid, this security is implemented server side
          // in a real application
          if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
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

      }, 500);

    });

    return new Http(backend, options);
  },
  deps: [MockBackend, BaseRequestOptions]
};

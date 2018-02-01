import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

import { Session } from '../classes/session';
import { Course } from '../classes/course';

@Injectable()
export class VideoSessionService {

  session: Session;
  course: Course;

  private urlSessions = '/api-video-sessions';

  constructor(private http: Http) { }

  getSessionIdAndToken(mySessionId) {
    return this.http.get(this.urlSessions + "/get-sessionid-token/" + mySessionId)
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  removeUser(sessionName) {
    let jsonBody = JSON.stringify({
		  'lessonId': sessionName
	  });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers });
    return this.http.post(this.urlSessions + "/remove-user", jsonBody, options)
      .map(response => response.text())
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }

}

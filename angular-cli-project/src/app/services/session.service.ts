import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Session }                from '../classes/session';
import { CourseDetails } from '../classes/course-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class SessionService {

  private urlSessions = '/api/sessions';
  private urlCourseDetails = '/api/course-details';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getSessions(userId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.urlSessions, options) //Must send userId
      .map((response: Response) => response.json() as Session[])
      .catch(error => this.handleError(error));
  }

  getCourseDetails(sessionId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    let urlId = this.urlCourseDetails + '/' + sessionId;
    return this.http.get(urlId, options)
      .map((response: Response) => response.json() as CourseDetails)
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

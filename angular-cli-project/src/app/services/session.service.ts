import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Session }                from '../classes/session';
import { Course }                 from '../classes/course';
import { AuthenticationService }  from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class SessionService {

  private urlSessions = '/api-sessions';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  //POST new session. On success returns the updated Course that owns the posted session
  public newSession(session: Session, courseId: number){
    let body = JSON.stringify(session);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.urlSessions + "/course/" + courseId, body, options)
      .map(response => response.json() as Course)
      .catch(error => this.handleError(error));
  }

  //PUT existing session. On success returns the updated session
  public editSession(session: Session){
    let body = JSON.stringify(session);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.urlSessions + "/edit", body, options)
      .map(response => response.json() as Session)
      .catch(error => this.handleError(error));
  }

  //DELETE existing session. On success returns the deleted session
  public deleteSession(sessionId: number){
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.urlSessions + "/delete/" + sessionId, options)
      .map(response => response.json() as Session)
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

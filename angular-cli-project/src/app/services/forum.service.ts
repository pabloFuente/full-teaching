import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Session }                from '../classes/session';
import { SessionDetails } from '../classes/session-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class ForumService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  private urlNewEntry = "";
  private urlNewComment = "";

  //POST new entry, attached to the given forum ('session' parameter)
  public newEntry(entry, session){
    /*let body = JSON.stringify(entry);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    let url = this.urlNewEntry + "/session/" + session;
    return this.http.post(url, body, options)
      .map(response => response.json())
      .catch(error => this.handleError(error));*/
  }

  //POST new comment, updating the array of replays of the "father" comment if necessary
  public newComment(comment, entry, commentToReplay){
    /*let body = JSON.stringify(comment, commentToReplay);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    let url = this.urlNewComment + "/entry/" + entry;
    return this.http.post(url, body, options)
      .map(response => response.json())
      .catch(error => this.handleError(error));*/
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

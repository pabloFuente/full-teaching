import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Session }               from '../classes/session';
import { Entry }                 from '../classes/entry';
import { Comment }               from '../classes/comment';
import { Forum }                 from '../classes/forum';
import { CourseDetails }         from '../classes/course-details';
import { AuthenticationService } from './authentication.service';


import 'rxjs/Rx';

@Injectable()
export class ForumService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  private urlNewEntry = "/api-entries";
  private urlNewComment = "/api-comments";
  private urlEditForum = "/api-forum"

  //POST new Entry. Requires an Entry and the id of the CourseDetails that owns the Forum
  //On success returns the updated Forum that owns the posted entry
  public newEntry(entry: Entry, courseDetailsId: number){
    let body = JSON.stringify(entry);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.urlNewEntry + "/forum/" + courseDetailsId, body, options)
      .map(response => response.json() as Forum)
      .catch(error => this.handleError(error));
  }

  //POST new Comment. Requires a Comment, the id of the Entry that owns it and the id of the CourseDetails that owns the Forum
  //On success returns the update Entry that owns the posted comment
  public newComment(comment: Comment, entryId: number, courseDetailsId: number){
    let body = JSON.stringify(comment);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.post(this.urlNewComment + "/entry/" + entryId + "/forum/" + courseDetailsId, body, options)
      .map(response => response.json() as Entry)
      .catch(error => this.handleError(error));
  }

  //PUT existing Forum. Requires a boolean value for activating/deactivating the Forum and the id of the CourseDetails that owns it
  //On success returns the updated 'activated' attribute
  public editForum(activated: boolean, courseDetailsId: number){
    let body = JSON.stringify(activated);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.urlEditForum + "/edit/" + courseDetailsId, body, options)
      .map(response => response.json() as boolean)
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

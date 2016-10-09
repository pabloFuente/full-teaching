import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Lesson }                from '../classes/lesson';
import { LessonDetails } from '../classes/lesson-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class ForumService {

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  //HTTP Methods to add new comments to the forum

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

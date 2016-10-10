import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Lesson }                from '../classes/lesson';
import { LessonDetails } from '../classes/lesson-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class LessonService {

  private urlLessons = '/api/lessons';
  private urlLessonDetails = '/api/lesson-details';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getLessons(userId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.urlLessons, options) //Must send userId
      .map((response: Response) => response.json() as Lesson[])
      .catch(error => this.handleError(error));
  }

  getLessonDetails(lessonId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    let urlId = this.urlLessonDetails + '/' + lessonId;
    return this.http.get(urlId, options)
      .map((response: Response) => response.json() as LessonDetails)
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

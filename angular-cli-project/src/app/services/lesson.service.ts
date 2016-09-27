import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Lesson }                from '../lesson';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class LessonService {

  private url = '/api/lessons';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getLessons() {
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.url, options)
      .map((response: Response) => response.json() as Lesson[])
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

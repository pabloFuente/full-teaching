import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Course }                from '../classes/course';
import { CourseDetails } from '../classes/course-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class CourseService {

  private urlCourses = '/api/courses';
  private urlCourseDetails = '/api/course-details';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getCourses() {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.urlCourses, options) //Must send userId
      .map((response: Response) => response.json() as Course[])
      .catch(error => this.handleError(error));
  }

  getCourse(courseId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.getCourses().subscribe(courses => courses.find(course => course.id === courseId));
  }

  getCourseDetails(courseId) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    let urlId = this.urlCourseDetails + '/' + courseId;
    return this.http.get(urlId, options)
      .map((response: Response) => response.json() as CourseDetails)
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

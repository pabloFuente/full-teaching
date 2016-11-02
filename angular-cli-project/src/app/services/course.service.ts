import { Injectable }                              from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable }                              from 'rxjs/Observable';

import { Course }                from '../classes/course';
import { User }                  from '../classes/user';
import { CourseDetails }         from '../classes/course-details';
import { AuthenticationService } from './authentication.service';

import 'rxjs/Rx';

@Injectable()
export class CourseService {

  private urlCourses = '/courses';
  private urlCourseDetails = '/api/course-details';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getCourses(user: User) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.urlCourses + "/user/" + user.id, options) //Must send userId
      .map((response: Response) => response.json() as Course[])
      .catch(error => this.handleError(error));
  }

  getCourse(courseId: number) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.urlCourses + "/course/" + courseId, options) //Must send userId
      .map((response: Response) => response.json() as Course)
      .catch(error => this.handleError(error));
  }

  newCourse(course: Course){
      let body = JSON.stringify(course);
      let headers = new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      });
      let options = new RequestOptions({ headers });
      return this.http.post(this.urlCourses + "/new", body, options)
        .map(response => response.json() as Course)
        .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

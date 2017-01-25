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

  private url = '/api-courses';

  constructor(private http: Http, private authenticationService: AuthenticationService) { }

  getCourses(user: User) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.url + "/user/" + user.id, options) //Must send userId
      .map((response: Response) => response.json() as Course[])
      .catch(error => this.handleError(error));
  }

  getCourse(courseId: number) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.get(this.url + "/course/" + courseId, options) //Must send userId
      .map((response: Response) => response.json() as Course)
      .catch(error => this.handleError(error));
  }

  //POST new course. On success returns the created course
  newCourse(course: Course){
      let body = JSON.stringify(course);
      let headers = new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      });
      let options = new RequestOptions({ headers });
      return this.http.post(this.url + "/new", body, options)
        .map(response => response.json() as Course)
        .catch(error => this.handleError(error));
  }

  //PUT existing course. On success returns the updated course
  public editCourse(course: Course){
    let body = JSON.stringify(course);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit", body, options)
      .map(response => response.json() as Course)
      .catch(error => this.handleError(error));
  }

  //DELETE existing course. On success returns the deleted course (simplified version)
  public deleteCourse(courseId: number){
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.delete(this.url + "/delete/" + courseId, options)
      .map(response => response.json() as Course)
      .catch(error => this.handleError(error));
  }

  //PUT existing course, modifying its attenders (adding them). On success returns the updated course.attenders array
  public addCourseAttenders(courseId: number, userEmails: string[]){
    let body = JSON.stringify(userEmails);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit/add-attenders/course/" + courseId, body, options)
      .map(response => response.json())
      .catch(error => this.handleError(error));
  }

  //PUT existing course, modifying its attenders (deleting them). On success returns the updated course.attenders array
  public deleteCourseAttenders(course: Course){
    let body = JSON.stringify(course);
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.authenticationService.token });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/edit/delete-attenders", body, options)
      .map(response => response.json() as User[])
      .catch(error => this.handleError(error));
  }

  private handleError(error: any) {
    console.error(error);
    return Observable.throw("Server error (" + error.status + "): " + error.text())
  }
}

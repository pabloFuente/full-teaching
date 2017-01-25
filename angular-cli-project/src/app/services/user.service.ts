import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../classes/user';

@Injectable()
export class UserService {

  private url = '/api-users';

  constructor(private http: Http) { }

  newUser(name: string, pass: string, nickName: string, captchaToken: string) {
    let body = JSON.stringify([name, pass, nickName, captchaToken]);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = new RequestOptions({ headers });
    return this.http.post(this.url + "/new", body, options)
    .map(response => response.json() as User)
    .catch(error => this.handleError(error));
  }

  changePassword(oldPassword: string, newPassword: string){
    let body = JSON.stringify([oldPassword, newPassword]);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });
    let options = new RequestOptions({ headers });
    return this.http.put(this.url + "/changePassword", body, options)
    .map(response => response.json() as boolean)
    .catch(error => this.handleError(error));
  }

  // private helper methods

 private jwt() {
    // create authorization header with jwt token
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }

  private handleError(error: any) {
    return Observable.throw(error.status);
  }
}

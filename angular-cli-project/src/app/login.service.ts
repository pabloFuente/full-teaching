import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import {Router} from '@angular/router';

import { Observable } from 'rxjs/Rx';

export class User {
  constructor(
    public email: string,
    public password: string) { }
}

var users = [
  new User('admin@admin.com','admin'),
  new User('user@gmail.com','user')
];

@Injectable()
export class LoginService {

  private loggedIn = false;
  private loginUrl = "/login";

  constructor(private http: Http, private router:Router) {
    this.loggedIn = !!localStorage.getItem('auth_token');
  }

  /*UPGRADED VERSION*/
  /*login(email, password) {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');

    return this.http
      .post(this.loginUrl, JSON.stringify({ email, password }), { headers })
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('auth_token', res.auth_token);
          this.loggedIn = true;
        }
        return res.success;
      });
  }*/

  /*UPGRADED VERSION*/
  /*logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }*/

  /*TEST VERSION*/
  login(user) {
    var authenticatedUser = users.find(u => u.email === user.email);
        if (authenticatedUser && authenticatedUser.password === user.password){
          localStorage.setItem("user", JSON.stringify(authenticatedUser));
          this.router.navigate(['/dashboard']);
          this.loggedIn = true;
          return true;
        }
        return false;
  }

  /*TEST VERSION*/
  logout() {
    localStorage.removeItem("user");
    this.router.navigate(['']);
  }

  /*TEST VERSION*/
  checkCredentials(){
    if (localStorage.getItem("user") === null){
        this.router.navigate(['']);
        return true;
    }
    return false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}

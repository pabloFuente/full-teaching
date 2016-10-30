import { Injectable }               from '@angular/core';
import { Http, RequestOptions, Headers, Response }  from '@angular/http';
import { Router }                   from '@angular/router';
import { Observable }               from 'rxjs';
import 'rxjs/add/operator/map';

import { User } from '../classes/user';

@Injectable()
export class AuthenticationService {

  public token: string;
  private user: User;
  private role: string;

  constructor(private http: Http, private router: Router) {
    this.reqIsLogged();

    // set token if saved in local storage
    let auth_token = JSON.parse(localStorage.getItem('auth_token'));
    this.token = auth_token && auth_token.token;
  }

  logIn(email, pass) {

    console.log("3 - LOGIN SERVICE STARTED");

    let userPass = email + ":" + pass;
    let headers = new Headers({
  			'Authorization': 'Basic '+ utf8_to_b64(userPass),
  			'X-Requested-With': 'XMLHttpRequest'});
    let options = new RequestOptions({headers});

    return this.http.get('logIn', options)
      .map((response: Response) => {
        this.processLogInResponse(response);
        return this.user;

    /*return this.http.post('/api/authenticate', JSON.stringify({ email: email, pass: pass }))
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;

          // store email and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('auth_token', JSON.stringify({ email: email, token: token }));
          localStorage.setItem('current_user', JSON.stringify( response.json().user ));
          // stores the user information in this.user attribute

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          this.user = null;
          return false;
        }*/
      });
  }

  logOut() {
    return this.http.get('logOut').map(
			response => {
				this.user = null;
				this.role = null;

        // clear token remove user from local storage to log user out and navigates to welcome page
        this.token = null;
        localStorage.removeItem('current_user');
        localStorage.removeItem('auth_token');
        this.router.navigate(['']);

				return response;
			}
		);


  }

  private processLogInResponse(response){
      // Correctly logged in
      console.log("4 - LOGIN EXTREMELY SUCCESFUL");
      console.log(response.json());

  		this.user = response.json();

      localStorage.setItem("login", "FULLTEACHING");
      if(this.user.roles.indexOf("ROLE_ADMIN") !== -1){
        this.role = "ROLE_ADMIN";
        localStorage.setItem("rol", "ROLE_ADMIN");
      }
      if(this.user.roles.indexOf("ROLE_TEACHER") !== -1){
        this.role = "ROLE_TEACHER";
        localStorage.setItem("rol", "ROLE_TEACHER");
      }
      if(this.user.roles.indexOf("ROLE_STUDENT") !== -1){
        this.role = "ROLE_STUDENT";
        localStorage.setItem("rol", "ROLE_STUDENT");
      }
  	}

  reqIsLogged(){
  		let headers = new Headers({
  			'X-Requested-With': 'XMLHttpRequest'
  		});
  		let options = new RequestOptions({headers});

  		this.http.get('logIn', options).subscribe(
  			response => this.processLogInResponse(response),
  			error => {
  				if(error.status != 401){
  					console.error("Error when asking if logged: "+ JSON.stringify(error));
            this.logOut();
  				}
  			}
  		);
  	}

  checkCredentials() {
    if (!this.isLoggedIn()) {
      this.logOut();
    }
  }

  isLoggedIn() {
    return (!!localStorage.getItem('auth_token') && this.user && this.token);
  }

  getCurrentUser() {
    return this.user;
  }

  isTeacher() {
    return ((this.user.roles.indexOf("ROLE_TEACHER")) !== -1) && (JSON.parse(localStorage.getItem('current_user')).roles.indexOF("ROLE_TEACHER")) !== -1;
  }

  isStudent() {
    return ((this.user.roles.indexOf("ROLE_STUDENT")) !== -1) && (JSON.parse(localStorage.getItem('current_user')).roles.indexOF("ROLE_STUDENT")) !== -1;
  }

  isAdmin() {
    return ((this.user.roles.indexOf("ROLE_ADMIN")) !== -1) && (JSON.parse(localStorage.getItem('current_user')).roles.indexOF("ROLE_ADMIN")) !== -1;
  }
}

function utf8_to_b64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode(<any>'0x' + p1);
  }));
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService, User } from './login.service';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent {

  private loginView: boolean;
  public user = new User('','');
  public errorMsg = '';

  constructor(private loginService: LoginService, private router: Router) {
    this.loginView = true;
  }

  changeView() {
    this.loginView = !this.loginView;
  }

  setLoginView() {
    this.loginView = true;
  }

  /*onSubmit(email: string, password: string) {
    console.log("Submit!: email = " + email + " , password = " + password);
    this.loginService.login(email, password).subscribe(
      response => {
        if (response) {
          this.router.navigate(['/dashboard']);
        }
      },
      error => console.log("Error de autenticación")
    );
  }*/

  onSubmit(email: string, password: string) {
    console.log("Submit!: email = " + email + " , password = " + password);
    this.loginService.login(new User(email, password));
    //this.router.navigate(['/dashboard']);
  }
}

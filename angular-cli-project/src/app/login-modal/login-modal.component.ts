import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent {

  private loginView: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    this.loginView = true;
    //this.authenticationService.logout();
  }

  changeView() {
    this.loginView = !this.loginView;
  }

  setLoginView() {
    this.loginView = true;
  }

  onSubmit(email: string, password: string) {
    console.log("Submit!: email = " + email + " , password = " + password);
    this.authenticationService.login(email, password).subscribe(
      result => {
        if (result) {
          // login successful
          this.router.navigate(['/dashboard']);
        } else {
          // login failed
          console.log("Error de autenticación");
        }
      }
    );
  }

}

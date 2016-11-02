import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalService } from '../../services/login-modal.service';
import { Constants } from '../../constants';

import { User } from '../../classes/user';

declare var Materialize : any;

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})

export class LoginModalComponent {

  private email: string;
  private password: string;
  private confirmPassword: string;

  private loginView: boolean;
  private fieldsIncorrect: boolean;
  private submitProcessing: boolean;
  private actions = new EventEmitter<string>();

  //Error message content
  private errorTitle: string;
  private errorContent: string;
  private customClass: string;

  private toastMessage: string;


  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private CONSTANTS: Constants,
    private loginModalService: LoginModalService) {

    this.loginView = true;
    this.fieldsIncorrect = false;
    this.submitProcessing = false;
    this.errorTitle = 'Invalid field';
    this.errorContent = 'Please check your email or password';
    this.customClass = 'fail';
    this.toastMessage = 'Login error! Check your email or password';

    // Suscription to LoginModal shared service (navbar actions on modal)
    this.loginModalService.wat$.subscribe((value) => {
       this.loginView = value;
    });
  }

  setLoginView(option: boolean) {
    if (option) {
      this.errorTitle = 'Invalid field';
      this.errorContent = 'Please check your email or password';
      this.customClass = 'fail';
      this.toastMessage = 'Login error! Check your email or password';
    }
    else {
      this.errorTitle = 'Invalid field';
      this.errorContent = 'Please check your passwords';
      this.customClass = 'fail';
      this.toastMessage = 'Sign up error! Check your email or password';
    }
    this.loginView = option;
  }

  onSubmit() {
    console.log("Submit: email = " + this.email + " , password = " + this.password + ", confirmPassword = " + this.confirmPassword);
    this.submitProcessing = true;

    // If login view is activated
    if (this.loginView) {

      console.log("Logging in...");

      this.authenticationService.logIn(this.email, this.password).subscribe(
        result => {
          this.submitProcessing = false;

          console.log("Login succesful! LOGGED AS " + this.authenticationService.getCurrentUser().name);

          // Login successful
          this.fieldsIncorrect = false;
          this.actions.emit("closeModal");
          this.router.navigate(['/courses']);
        },
        error => {

          console.log("Login failed (error): " + error);

          // Login failed
          this.logInFailed(error);
        }
      );
    }

    // If signup view is activated
    else {
      // Sign up

    }
  }

  logInFailed(error){
    this.submitProcessing = false;
    if (window.innerWidth <= this.CONSTANTS.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast(this.toastMessage, this.CONSTANTS.TOAST_SHOW_TIME);
    } else { // On desktop error on error-message
      this.fieldsIncorrect = true;
    }
  }

}

import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalService } from '../../services/login-modal.service';
import { UserService } from '../../services/user.service';
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
  private nickName: string;

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
    private userService: UserService,
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
    this.fieldsIncorrect = false;
    this.loginView = option;
  }

  onSubmit() {
    console.log("Submit: email = " + this.email + " , password = " + this.password + ", confirmPassword = " + this.confirmPassword);
    this.submitProcessing = true;

    // If login view is activated
    if (this.loginView) {
      console.log("Logging in...");
      this.logIn(this.email, this.password);
    }

    // If signup view is activated
    else {

      //Passwords don't match
      if (this.password !== this.confirmPassword) {
        this.errorTitle = 'Your passwords don\'t match!';
        this.errorContent = '';
        this.customClass = 'fail';
        this.toastMessage = 'Your passwords don\'t match!';
        this.handleError();
      }

      else {

        let userNameFixed = this.email;
        let userPasswordFixed = this.password;

        console.log("Signing up...");

        this.userService.newUser(userNameFixed, userPasswordFixed, this.nickName).subscribe(
          result => {
            this.logIn(userNameFixed, userPasswordFixed);
            console.log("Sing up succesful!");
          },
          error => {

            console.log("Sign up failed (error): " + error);

            this.errorTitle = 'Invalid email';
            this.errorContent = 'That email is already in use';
            this.customClass = 'fail';
            this.toastMessage = 'That email is already in used!';

            // Login failed
            this.handleError();
          }
        );
      }
    }
  }

  logIn(user: string, pass: string) {
    this.authenticationService.logIn(user, pass).subscribe(
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

        this.errorTitle = 'Invalid field';
        this.errorContent = 'Please check your email or password';
        this.customClass = 'fail';
        this.toastMessage = 'Login error! Check your email or password';

        // Login failed
        this.handleError();
      }
    );
  }

  handleError(){
    this.submitProcessing = false;
    if (window.innerWidth <= this.CONSTANTS.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast(this.toastMessage, this.CONSTANTS.TOAST_SHOW_TIME);
    } else { // On desktop error on error-message
      this.fieldsIncorrect = true;
    }
  }

}

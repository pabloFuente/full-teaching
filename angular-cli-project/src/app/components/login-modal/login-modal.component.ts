import { Component, EventEmitter } from '@angular/core';
import { Router }                  from '@angular/router';

import { environment } from '../../../environments/environment';

import { MaterializeAction } from 'angular2-materialize';

import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalService }     from '../../services/login-modal.service';
import { UserService }           from '../../services/user.service';
import { Constants }             from '../../constants';

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
  private actions = new EventEmitter<string|MaterializeAction>();

  private captchaValidated: boolean = false;
  private captchaPublicKey: string;
  private captchaToken: string;

  //Error message content
  private errorTitle: string;
  private errorContent: string;
  private customClass: string;
  private toastMessage: string;


  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private loginModalService: LoginModalService) {

    this.loginView = true;
    this.fieldsIncorrect = false;
    this.submitProcessing = false;
    this.errorTitle = 'Invalid field';
    this.errorContent = 'Please check your email or password';
    this.customClass = 'fail';
    this.toastMessage = 'Login error! Check your email or password';

    this.captchaPublicKey = environment.PUBLIC_RECAPTCHA_KEY;

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
      console.log("Signing up...");
      this.signUp();
    }
  }

  logIn(user: string, pass: string) {
    this.authenticationService.logIn(user, pass).subscribe(
      result => {
        this.submitProcessing = false;

        console.log("Login succesful! LOGGED AS " + this.authenticationService.getCurrentUser().name);

        // Login successful
        this.fieldsIncorrect = false;
        this.actions.emit({action:"modal",params:['close']});
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

  signUp() {

    //Captcha has not been validated (user must have tricked the front-end in order to enter this if)
    if(!this.captchaValidated){
      this.errorTitle = 'You must validate the captcha!';
      this.errorContent = '';
      this.customClass = 'fail';
      this.toastMessage = 'Your must validate the captcha!';
      this.handleError();
    }
    else{

      //Passwords don't match
      if (this.password !== this.confirmPassword) {
        this.errorTitle = 'Your passwords don\'t match!';
        this.errorContent = '';
        this.customClass = 'fail';
        this.toastMessage = 'Your passwords don\'t match!';
        this.handleError();
      }

      else {

        let regex = new RegExp(Constants.PASS_REGEX);

        if (!(this.password.match(regex))){
          this.errorTitle = 'Your password does not have a valid format!';
          this.errorContent = 'It must be at least 8 characters long and include one uppercase, one lowercase and a number';
          this.customClass = 'fail';
          this.toastMessage = 'Password must be 8 characters long, one upperCase, one lowerCase and a number';
          this.handleError();
        }

        else {

          let userNameFixed = this.email;
          let userPasswordFixed = this.password;

          this.userService.newUser(userNameFixed, userPasswordFixed, this.nickName, this.captchaToken).subscribe(
            result => {

              //Sign up succesful
              this.logIn(userNameFixed, userPasswordFixed);
              console.log("Sign up succesful!");
            },
            error => {

              console.log("Sign up failed (error): " + error);
              if (error === 409){ //CONFLICT: Email already in use
                this.errorTitle = 'Invalid email';
                this.errorContent = 'That email is already in use';
                this.customClass = 'fail';
                this.toastMessage = 'That email is already in use!';
              }
              else if (error === 400){ //BAD_REQUEST: Invalid password format
                this.errorTitle = 'Invalid password format';
                this.errorContent = 'Our server has rejected that password';
                this.customClass = 'fail';
                this.toastMessage = 'That password has not a valid format according to our server!';
              }
              else if (error === 403){ //FORBIDDEN: Invalid email format
                this.errorTitle = 'Invalid email format';
                this.errorContent = 'Our server has rejected that email';
                this.customClass = 'fail';
                this.toastMessage = 'That email has not a valid format according to our server!';
              }
              else if (error === 401){ //UNAUTHORIZED: Captcha not validated
                this.errorTitle = 'Captcha not validated!';
                this.errorContent = 'I am sorry, but your bot does not work here :)';
                this.customClass = 'fail';
                this.toastMessage = 'You must be a human to sign up here!';
              }

              // Sign up failed
              this.handleError();
            }
          );
        }
      }
    }
  }

  handleCorrectCaptcha(event){
    this.captchaToken = event;
    this.captchaValidated = true;
  }

  handleError(){
    this.submitProcessing = false;
    if (window.innerWidth <= Constants.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast(this.toastMessage, Constants.TOAST_SHOW_TIME, 'rounded');
    } else { // On desktop error on error-message
      this.fieldsIncorrect = true;
    }
  }

}

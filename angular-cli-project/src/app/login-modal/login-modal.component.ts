import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { LoginModalService } from '../services/login-modal.service';
import { Constants } from '../constants';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css'],
})

export class LoginModalComponent {

  private loginView: boolean;
  private fieldsIncorrect: boolean;
  private submitProcessing: boolean;
  private actions = new EventEmitter<string>();

  //Error message content
  private errorTitle: string;
  private errorContent: string;
  private customClass: string;
  private closable: boolean;

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
    this.closable = true;
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
      this.closable = true;
      this.toastMessage = 'Login error! Check your email or password';
    }
    else {
      this.errorTitle = 'Invalid field';
      this.errorContent = 'Please check your passwords';
      this.customClass = 'fail';
      this.closable = true;
      this.toastMessage = 'Sign up error! Check your email or password';
    }
    this.loginView = option;
  }

  onSubmit(email: string, password: string, confirmPassword: string) {
    console.log("Submit!: email = " + email + " , password = " + password + " , confirmPassword = " + confirmPassword);
    this.submitProcessing = true;

    // If login view is activated
    if (this.loginView) {
      this.authenticationService.login(email, password).subscribe(
        result => {
          this.submitProcessing = false;
          if (result) {
            // Login successful
            this.fieldsIncorrect = false;
            this.actions.emit("closeModal");
            this.router.navigate(['/dashboard']);
          } else {
            // Login failed
            if (window.innerWidth <= this.CONSTANTS.PHONE_MAX_WIDTH) { // On mobile phones error on toast
              Materialize.toast(this.toastMessage, this.CONSTANTS.TOAST_SHOW_TIME);
            } else { // On desktop error on error-message
              this.fieldsIncorrect = true;
            }
          }
        }
      );
    }

    // If signup view is activated
    else {
      // Sign up
    }
  }

}

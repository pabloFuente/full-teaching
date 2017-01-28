import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { FileUploader }      from 'ng2-file-upload';

import { AuthenticationService }   from '../../services/authentication.service';
import { UserService }             from '../../services/user.service';
import { AnimationService }        from '../../services/animation.service';
import { User }                    from '../../classes/user';
import { Constants }               from '../../constants';

declare var Materialize : any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private user: User;

  private URL_UPLOAD: string;

  private processingPic: boolean = false;
  private processingPass: boolean = false;

  private submitProcessing: boolean;
  private fieldsIncorrect: boolean = false;

  inputCurrentPassword: string;
  inputNewPassword: string;
  inputNewPassword2: string;

  //Error message content
  errorTitle: string;
  errorContent: string;
  customClass: string;
  toastMessage: string;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private animationService: AnimationService) {

    //URL for uploading files changes between development stage and production stage
    this.URL_UPLOAD = environment.URL_PIC_UPLOAD;
  }

  ngOnInit() {
    this.user = this.authenticationService.getCurrentUser();
  }

  pictureUploadStarted(started: boolean){
    this.processingPic = started;
  }

  pictureUploadCompleted(response){
    console.log("Picture changed successfully: " + response);
    this.user.picture = response;
    this.processingPic = false;
  }

  onPasswordSubmit(){

    this.processingPass = true;

    //New passwords don't match
    if (this.inputNewPassword !== this.inputNewPassword2) {
      this.errorTitle = 'Your passwords don\'t match!';
      this.errorContent = '';
      this.customClass = 'fail';
      this.toastMessage = 'Your passwords don\'t match!';
      this.handleError();
    }
    else{

      let regex = new RegExp(Constants.PASS_REGEX);

      //The new password does not have a valid format
      if (!(this.inputNewPassword.match(regex))){
        this.errorTitle = 'Your new password does not have a valid format!';
        this.errorContent = 'It must be at least 8 characters long and include one uppercase, one lowercase and a number';
        this.customClass = 'fail';
        this.toastMessage = 'Your new password must be 8 characters long, one upperCase, one lowerCase and a number';
        this.handleError();
      }
      else{
        this.userService.changePassword(this.inputCurrentPassword, this.inputNewPassword).subscribe(
          result => {
            //Password changed succesfully
            console.log("Password changed succesfully!");

            this.inputCurrentPassword = '';
            this.inputNewPassword = '';
            this.inputNewPassword2 = '';

            this.submitProcessing = false;
            this.fieldsIncorrect = false;

            this.errorTitle = 'Password changed succesfully!';
            this.errorContent = '';
            this.customClass = 'correct';
            this.toastMessage = 'Your password has been correctly changed';

            this.handleError();
          },
          error => {
            console.log("Password change failed (error): " + error);
            if (error === 304){ //NOT_MODIFIED: New password not valid
              this.errorTitle = 'Your new password does not have a valid format!';
              this.errorContent = 'It must be at least 8 characters long and include one uppercase, one lowercase and a number';
              this.customClass = 'fail';
              this.toastMessage = 'Your new password must be 8 characters long, one upperCase, one lowerCase and a number';
            }
            else if (error === 409){ //CONFLICT: Current password not valid
              this.errorTitle = 'Invalid current password';
              this.errorContent = 'Our server has rejected that password';
              this.customClass = 'fail';
              this.toastMessage = 'Your current password is wrong!';
            }

            // Password change failed
            this.handleError();
          }
        );
      }
    }
  }

  handleError(){
    this.processingPass = false;
    if (window.innerWidth <= Constants.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast(this.toastMessage, Constants.TOAST_SHOW_TIME, 'rounded');
    } else { // On desktop error on error-message
      this.fieldsIncorrect = true;
    }
  }

}

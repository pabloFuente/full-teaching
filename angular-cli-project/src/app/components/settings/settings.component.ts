import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

import { FileUploader }      from 'ng2-file-upload';

import { AuthenticationService }   from '../../services/authentication.service';
import { UserService }             from '../../services/user.service';
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

  public picUploader:FileUploader;
  public hasBaseDropZoneOverPic:boolean = false;

  private URL_UPLOAD: string;

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
    private CONSTANTS: Constants) {

    //URL for uploading files changes between development stage and production stage
    this.URL_UPLOAD = environment.URL_PIC_UPLOAD;
  }

  ngOnInit() {
    this.user = this.authenticationService.getCurrentUser();
    this.picUploader = new FileUploader({url: this.URL_UPLOAD + this.user.id});
    this.picUploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("Picture changed successfully" + response);
      this.user.picture = response;
      this.picUploader.clearQueue();
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOverPic = e;
  }

  onPasswordSubmit(){

    this.submitProcessing = true;

    //New passwords don't match
    if (this.inputNewPassword !== this.inputNewPassword2) {
      this.errorTitle = 'Your passwords don\'t match!';
      this.errorContent = '';
      this.customClass = 'fail';
      this.toastMessage = 'Your passwords don\'t match!';
      this.handleError();
    }
    else{

      let regex = new RegExp(this.CONSTANTS.PASS_REGEX);

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
    this.submitProcessing = false;
    if (window.innerWidth <= this.CONSTANTS.PHONE_MAX_WIDTH) { // On mobile phones error on toast
      Materialize.toast(this.toastMessage, this.CONSTANTS.TOAST_SHOW_TIME);
    } else { // On desktop error on error-message
      this.fieldsIncorrect = true;
    }
  }

}

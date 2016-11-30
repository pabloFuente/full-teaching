import { Component, OnInit } from '@angular/core';

import { FileUploader }      from 'ng2-file-upload';

import { AuthenticationService }   from '../../services/authentication.service';
import { User }                    from '../../classes/user';

//ONLY ON PRODUCTION
//const URL_PIC_UPLOAD = 'http://full-teaching-prod.eu-west-1.elasticbeanstalk.com/load-files/upload/picture/';

//ONLY ON DEVELOPMENT
const URL_PIC_UPLOAD = 'http://localhost:5000/load-files/upload/picture/';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private user: User;

  public picUploader:FileUploader;
  public hasBaseDropZoneOverPic:boolean = false;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.user = this.authenticationService.getCurrentUser();
    this.picUploader = new FileUploader({url: URL_PIC_UPLOAD + this.user.id});
    this.picUploader.onCompleteItem = (item:any, response:string, status:number, headers:any)=> {
      console.log("Picture changed successfully" + response);
      this.user.picture = response;
      this.picUploader.clearQueue();
    }
  }

  fileOverBase(e:any):void {
    this.hasBaseDropZoneOverPic = e;
  }

}

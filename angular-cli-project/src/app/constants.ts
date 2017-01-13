import { Injectable } from '@angular/core';

@Injectable()
export class Constants {

  PHONE_MAX_WIDTH: number;
  TOAST_SHOW_TIME: number;
  URL_UPLOAD_PROD: string;
  URL_UPLOAD_DEV: string;
  URL_PIC_UPLOAD_PROD: string;
  URL_PIC_UPLOAD_DEV: string;
  PASS_REGEX: string;

  constructor() {
    this.PHONE_MAX_WIDTH = 500;
    this.TOAST_SHOW_TIME = 4000;
    this.URL_UPLOAD_PROD = 'http://full-teaching-prod.eu-west-1.elasticbeanstalk.com/load-files/upload/course/';
    this.URL_UPLOAD_DEV = 'http://localhost:5000/load-files/upload/course/';
    this.URL_PIC_UPLOAD_PROD = 'http://full-teaching-prod.eu-west-1.elasticbeanstalk.com/load-files/upload/picture/';
    this.URL_PIC_UPLOAD_DEV = 'http://localhost:5000/load-files/upload/picture/';
    this.PASS_REGEX = '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$';
  }
}

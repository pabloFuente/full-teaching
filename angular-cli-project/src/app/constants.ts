import { Injectable } from '@angular/core';

@Injectable()
export class Constants {

  PHONE_MAX_WIDTH: number;
  TOAST_SHOW_TIME: number;
  PASS_REGEX: string;

  constructor() {
    this.PHONE_MAX_WIDTH = 500;
    this.TOAST_SHOW_TIME = 4000;
    this.PASS_REGEX = '^((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20})$';
  }
}

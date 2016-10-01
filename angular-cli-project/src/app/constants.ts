import { Injectable } from '@angular/core';

@Injectable()
export class Constants {

  PHONE_MAX_WIDTH: number;
  TOAST_SHOW_TIME: number;

  constructor() {
    this.PHONE_MAX_WIDTH = 500;
    this.TOAST_SHOW_TIME = 4000;
  }
}

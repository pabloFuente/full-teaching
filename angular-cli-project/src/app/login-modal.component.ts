import { Component } from '@angular/core';

@Component({
  selector: 'login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent  {

  loginView: boolean;

  constructor(){
    this.loginView = true;
  }

  changeView(){
    this.loginView = !this.loginView;
  }

  setLoginView(){
    this.loginView = true;
  }

}

import { Component, Output, EventEmitter } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent  {

  constructor(private loginService: LoginService) { }

  @Output() signNavButtonEvent = new EventEmitter();

  signNavButton(){
    this.signNavButtonEvent.emit(null);
  }

}

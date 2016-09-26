import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent  {

  @Output() signNavButtonEvent = new EventEmitter();

  signNavButton(){
    this.signNavButtonEvent.emit(null);
  }

}

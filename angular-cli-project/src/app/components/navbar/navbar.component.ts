import { Component, EventEmitter, Output } from '@angular/core';
import { Location }                        from '@angular/common';

import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalService }     from '../../services/login-modal.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authenticationService: AuthenticationService, private loginModalService: LoginModalService, private location: Location) { }

  updateLoginModalView(b: boolean){
    this.loginModalService.activateLoginView(b);
  }

  //Checks if the route is "/courses".
  public addSessionHidden() {
    let list = ["/courses"],
        route = this.location.path();
    return (list.indexOf(route) > -1);
  }

  logout(){
    this.authenticationService.logOut().subscribe(
  		response => { $("div.drag-target").remove(); }, //This deletes the draggable element for the side menu (external to the menu itself in the DOM)
  		error => console.log("Error when trying to log out: " + error)
  	);
  }

}

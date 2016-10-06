import { Component, EventEmitter, Output } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalService }     from '../../services/login-modal.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authenticationService: AuthenticationService, private loginModalService: LoginModalService) { }

  updateLoginModalView(b: boolean){
    this.loginModalService.activateLoginView(b);
  }

}

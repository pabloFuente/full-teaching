import { Component, OnInit } from '@angular/core';

import { AuthenticationService }   from '../../services/authentication.service';
import { User }                    from '../../classes/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private user: User;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.user = this.authenticationService.getCurrentUser();
  }

}

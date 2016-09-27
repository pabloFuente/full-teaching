import { Component }             from '@angular/core';
import { Router }                from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})

export class PresentationComponent {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  onLogout() {
      this.authenticationService.logout();
        /*.subscribe(
          () => this.router.navigate(['']),
        );*/
    }
}

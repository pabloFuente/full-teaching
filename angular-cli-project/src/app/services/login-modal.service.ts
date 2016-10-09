import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginModalService {

  wat$: Subject<boolean>;

  constructor() {
    this.wat$ = new Subject<boolean>();
  }

  activateLoginView(b: boolean) {
    this.wat$.next(b);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LoginModalService {

  wat$: Subject<any>;

  constructor() {
    this.wat$ = new Subject();
  }

  activateLoginView(b: boolean) {
    this.wat$.next(b);
  }
}

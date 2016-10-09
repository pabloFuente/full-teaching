import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ForumModalDataService {

  modeAnnounced$: Subject<any>;

  constructor(){
    this.modeAnnounced$ = new Subject<any>();
  }

  announceMode(objs){
    this.modeAnnounced$.next(objs);
  }

}

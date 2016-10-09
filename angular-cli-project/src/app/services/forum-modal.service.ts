import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ForumModalService {

  indexAnnounced$: Subject<number>;

  constructor(){
    this.indexAnnounced$ = new Subject<number>();
  }

  announceIndex(i: number){
    this.indexAnnounced$.next(i);
  }

}

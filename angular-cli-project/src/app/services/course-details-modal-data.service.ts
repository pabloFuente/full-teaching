import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CourseDetailsModalDataService {

  postModeAnnounced$: Subject<any>;
  putdeleteModeAnnounced$: Subject<any>;

  constructor(){
    this.postModeAnnounced$ = new Subject<any>();
    this.putdeleteModeAnnounced$ = new Subject<any>();
  }

  announcePostMode(objs){
    this.postModeAnnounced$.next(objs);
  }

  announcePutdeleteMode(objs){
    this.putdeleteModeAnnounced$.next(objs);
  }

  animateIfSmall(){
    if($(window).width() <= 600 || $(window).height() <= 600) $('html,body').animate({scrollTop:0},200);
  }

}

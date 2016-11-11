import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilesEditionService {

  modeEditAnnounced$: Subject<boolean>;

  modeEdit: boolean = false;

  constructor(){
    this.modeEditAnnounced$ = new Subject<boolean>();
  }

  announceModeEdit(objs){
    this.modeEdit = objs;
    this.modeEditAnnounced$.next(objs);
  }

}

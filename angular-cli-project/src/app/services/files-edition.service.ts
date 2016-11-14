import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilesEditionService {

  modeEditAnnounced$: Subject<boolean>;
  fileGroupDeletedAnnounced$: Subject<number>;

  modeEdit: boolean = false;

  constructor(){
    this.modeEditAnnounced$ = new Subject<boolean>();
    this.fileGroupDeletedAnnounced$ = new Subject<number>();
  }

  announceModeEdit(objs){
    this.modeEdit = objs;
    this.modeEditAnnounced$.next(objs);
  }

  announceFileGroupDeleted(fileGroupDeletedId: number){
    this.fileGroupDeletedAnnounced$.next(fileGroupDeletedId);
  }

}

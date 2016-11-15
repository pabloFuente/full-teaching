import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilesEditionService {

  modeEditAnnounced$: Subject<boolean>;
  fileGroupDeletedAnnounced$: Subject<number>;
  fileFilegroupUpdatedAnnounced$: Subject<number>;

  currentModeEdit: boolean = false;

  constructor(){
    this.modeEditAnnounced$ = new Subject<boolean>();
    this.fileGroupDeletedAnnounced$ = new Subject<number>();
    this.fileFilegroupUpdatedAnnounced$ = new Subject<any>();
  }

  announceModeEdit(objs){
    this.currentModeEdit = objs;
    this.modeEditAnnounced$.next(objs);
  }

  announceFileGroupDeleted(fileGroupDeletedId: number){
    this.fileGroupDeletedAnnounced$.next(fileGroupDeletedId);
  }

  announceFileFilegroupUpdated(objs){
    this.fileFilegroupUpdatedAnnounced$.next(objs);
  }

}

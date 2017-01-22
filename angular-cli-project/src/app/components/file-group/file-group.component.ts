import { Component, OnInit, Input } from '@angular/core';

import { Subscription }             from 'rxjs/Subscription';

import { File }      from '../../classes/file';
import { FileGroup } from '../../classes/file-group';

import { FileService }           from '../../services/file.service';
import { FilesEditionService }   from '../../services/files-edition.service';
import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';
import { AuthenticationService } from '../../services/authentication.service';
import { AnimationService }      from '../../services/animation.service';


@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css']
})
export class FileGroupComponent implements OnInit {

  @Input()
  public fileGroup: FileGroup;

  @Input()
  public courseId: number;

  @Input()
  public depth: number;

  modeEditActive: boolean = false;

  subscription: Subscription;

  typeOfFile = ['language', 'picture_as_pdf', 'videocam'];

  constructor(
    private fileService: FileService,
    private filesEditionService: FilesEditionService,
    private courseDetailsModalDataService: CourseDetailsModalDataService,
    private authenticationService: AuthenticationService,
    private animationService: AnimationService) {

    this.subscription = filesEditionService.modeEditAnnounced$.subscribe(
      active => {
        this.modeEditActive = active;
      });
  }

  ngOnInit() {
    this.modeEditActive = this.filesEditionService.currentModeEdit;
  }

  updatePostModalMode(mode: number, title: string) {
    let objs = [mode, title, null, null, this.fileGroup];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }

  updatePutdeleteModalMode(mode: number, title: string) {
    let objs = [mode, title];
    this.courseDetailsModalDataService.announcePutdeleteMode(objs);
  }

  changeUpdatedFileGroup(){
    let objs = [this.fileGroup, null];
    this.filesEditionService.announceFileFilegroupUpdated(objs);
  }

  changeUpdatedFile(file: File){
    let objs = [this.fileGroup, file];
    this.filesEditionService.announceFileFilegroupUpdated(objs);
  }

  deleteFileGroup(){
    console.log(this.fileGroup);
    console.log(this.fileGroup.id, this.courseId);
    this.fileService.deleteFileGroup(this.fileGroup.id, this.courseId).subscribe(
      response => {
        console.log("FileGroup deleted");
        console.log(response);
        //Only on succesful DELETE we locally delete the fileGroup sending an event to the suscribed parent component (CourseDetailsComponent)
        this.filesEditionService.announceFileGroupDeleted(response.id);
      },
      error => console.log(error)
    );
  }

  deleteFile(file: File){
    console.log(file);
    console.log(file.id, this.fileGroup.id, this.courseId);
    this.fileService.deleteFile(file.id, this.fileGroup.id, this.courseId).subscribe(
      response => {
        console.log("File deleted");
        console.log(response);
        //Only on succesful delete we locally delete the file
        for (let i = 0; i < this.fileGroup.files.length; i++) {
          if (this.fileGroup.files[i].id == response.id) {
            this.fileGroup.files.splice(i, 1);
            break;
          }
        }
      },
      error => console.log(error)
    );
  }

  downloadFile(file: File){
    this.fileService.downloadFile(this.courseId, file);
  }

}

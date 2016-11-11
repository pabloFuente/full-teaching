import { Component, OnInit, Input } from '@angular/core';

import { Subscription }             from 'rxjs/Subscription';

import { FileGroup } from '../../classes/file-group';

import { FilesEditionService } from '../../services/files-edition.service';
import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-file-group',
  templateUrl: './file-group.component.html',
  styleUrls: ['./file-group.component.css']
})
export class FileGroupComponent implements OnInit {

  @Input()
  public fileGroup: FileGroup;

  @Input()
  public depth: number;

  modeEditActive: boolean = false;

  subscription: Subscription;

  typeOfFile = ['language', 'picture_as_pdf', 'videocam'];

  constructor(
    private filesEditionService: FilesEditionService,
    private courseDetailsModalDataService: CourseDetailsModalDataService,
    private authenticationService: AuthenticationService) {

    this.subscription = filesEditionService.modeEditAnnounced$.subscribe(
      active => {
        this.modeEditActive = active;
      });
  }

  ngOnInit() {
    this.modeEditActive = this.filesEditionService.modeEdit;
  }

  updatePostModalMode(mode: number, title: string) {
    let objs = [mode, title, null, null, this.fileGroup];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }


}

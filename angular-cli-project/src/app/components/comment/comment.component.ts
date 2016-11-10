import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';
import { Entry } from '../../classes/entry';

import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  constructor(private courseDetailsModalDataService: CourseDetailsModalDataService) {}

  ngOnInit() {}

  updatePostModalMode(mode: number, title: string, header: Entry, commentReplay: Comment){
    let objs = [mode, title, header, commentReplay];
    this.courseDetailsModalDataService.announcePostMode(objs);
  }

}

import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  constructor(private courseDetailsModalDataService: CourseDetailsModalDataService) {

  }

  ngOnInit() {

  }

  updateCourseDetailsModalMode(mode: number, header: string, commentReplay: string){
    let objs = [mode, header, commentReplay];
    this.courseDetailsModalDataService.announceMode(objs);
  }

}

import { Component, OnInit, OnChanges, Input, trigger, state, animate, transition, style } from '@angular/core';

import { CommentComponent } from '../comment/comment.component';

import { ForumModalTriggerService } from '../../services/forum-modal-trigger.service';
import { ForumModalDataService } from '../../services/forum-modal-data.service';

import { CourseDetails } from '../../classes/course-details';
import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-course-details',
  providers: [ForumModalTriggerService],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  animations: [
    trigger('fadeAnim', [
      state('commentsShown', style({
        opacity: 1
      })),
      state('commentsHidden', style({
        opacity: 0.2
      })),
      transition('commentsHidden => commentsShown', animate('.4s')),
      transition('commentsShown => commentsHidden', animate('.1s')),
    ]),
  ]
})
export class CourseDetailsComponent implements OnInit {

  @Input()
  sessionDetails: CourseDetails;

  @Input()
  sessionIndex: number;

  selectedEntry: Entry;

  fadeAnim = 'commentsShown';

  constructor(private forumModalService: ForumModalTriggerService, private forumModalDataService: ForumModalDataService) { }

  ngOnInit() {
    this.selectedEntry = this.sessionDetails.forum.entries[0];
    this.forumModalService.setCurrentIndex(this.sessionIndex);
  }

  updateForumModalMode(mode: number, header: string, commentReplay: string){
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }
}

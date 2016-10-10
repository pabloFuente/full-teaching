import { Component, OnInit, OnChanges, Input, trigger, state, animate, transition, style } from '@angular/core';

import { CommentComponent } from '../comment/comment.component';

import { ForumModalTriggerService } from '../../services/forum-modal-trigger.service';
import { ForumModalDataService } from '../../services/forum-modal-data.service';

import { LessonDetails } from '../../classes/lesson-details';
import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-lesson-details',
  providers: [ForumModalTriggerService],
  templateUrl: './lesson-details.component.html',
  styleUrls: ['./lesson-details.component.css'],
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
export class LessonDetailsComponent implements OnInit {

  @Input()
  lessonDetails: LessonDetails;

  @Input()
  lessonIndex: number;

  selectedEntry: Entry;

  fadeAnim = 'commentsShown';

  constructor(private forumModalService: ForumModalTriggerService, private forumModalDataService: ForumModalDataService) { }

  ngOnInit() {
    this.selectedEntry = this.lessonDetails.forum.entries[0];
    this.forumModalService.setCurrentIndex(this.lessonIndex);
  }

  updateForumModalMode(mode: number, header: string, commentReplay: string){
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }
}

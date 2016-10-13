import { Component, OnInit, OnChanges, Input, trigger, state, animate, transition, style } from '@angular/core';

import { CommentComponent } from '../comment/comment.component';

import { ForumModalTriggerService } from '../../services/forum-modal-trigger.service';
import { ForumModalDataService } from '../../services/forum-modal-data.service';

import { SessionDetails } from '../../classes/session-details';
import { Entry } from '../../classes/entry';

@Component({
  selector: 'app-session-details',
  providers: [ForumModalTriggerService],
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.css'],
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
export class SessionDetailsComponent implements OnInit {

  @Input()
  sessionDetails: SessionDetails;

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

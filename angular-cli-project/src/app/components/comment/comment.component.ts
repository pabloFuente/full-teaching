import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

import { ForumModalTriggerService } from '../../services/forum-modal-trigger.service';
import { ForumModalDataService } from '../../services/forum-modal-data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  public lessonIndex: number;

  constructor(private forumModalService: ForumModalTriggerService, private forumModalDataService: ForumModalDataService) {

  }

  ngOnInit() {
    this.lessonIndex = this.forumModalService.getCurrentIndex();
  }

  updateForumModalMode(mode: number, header: string, commentReplay: string){
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }

}

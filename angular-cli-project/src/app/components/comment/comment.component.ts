import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

import { ForumModalService } from '../../services/forum-modal.service';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  @Input()
  public depth: number;

  public lessonIndex: number;

  subscription: Subscription;

  constructor(private forumModalService: ForumModalService) {
    this.subscription = forumModalService.indexAnnounced$.subscribe(
      i => {
        this.lessonIndex = i;
      });
  }

  ngOnInit() {
  }

  calculatePaddingLeft(){
    return ((this.depth * 20) + "px");
  }

}

import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

import { ForumModalService } from '../../services/forum-modal.service';

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

  constructor(private forumModalService: ForumModalService) {

  }

  ngOnInit() {
    this.lessonIndex = this.forumModalService.getCurrentIndex();
  }

  calculatePaddingLeft(){
    return ((this.depth * 20) + "px");
  }

}

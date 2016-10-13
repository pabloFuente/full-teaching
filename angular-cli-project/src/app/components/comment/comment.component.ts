import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

import { ForumModalDataService } from '../../services/forum-modal-data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input()
  public comment: Comment;

  constructor(private forumModalDataService: ForumModalDataService) {

  }

  ngOnInit() {

  }

  updateForumModalMode(mode: number, header: string, commentReplay: string){
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }

}

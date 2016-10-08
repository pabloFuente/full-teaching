import { Component, OnInit, Input } from '@angular/core';

import { Comment } from '../../classes/comment';

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

  constructor() { }

  ngOnInit() {
  }

  calculatePaddingLeft(){
    return ((this.depth * 20) + "px");
  }

}

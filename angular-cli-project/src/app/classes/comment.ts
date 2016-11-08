import { User } from './user';

export class Comment {

  public id?: number;
  public message: string;
  public date: Date;
  public replies: Comment[];
  public commentParent: Comment;
  public user: User;

  constructor(message: string, commentParent: Comment){
    this.message = message;
    this.replies = [];
    this.commentParent = commentParent;
    this.user = null; //Backend will take care of it
  }

}

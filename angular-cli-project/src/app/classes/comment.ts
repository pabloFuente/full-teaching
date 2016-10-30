import { User } from './user';

export class Comment {

  public id?: number;
  public message: string;
  public date: Date;
  public replies: Comment[];
  public user: User;

  constructor(user: User, message: string, date: Date, replies: Comment[]){
    this.user = user;
    this.message = message;
    this.date = date;
    this.replies = replies;
  }

}

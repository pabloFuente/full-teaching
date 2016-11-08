import { Comment } from './comment';
import { User } from './user';

export class Entry {

  public id?: number;
  public title: string;
  public date: Date;
  public comments: Comment[];
  public user: User;

  constructor(title: string, comments: Comment[]){
    this.title = title;
    this.comments = comments;
    this.user = null; //Backend will take care of it
  }


}

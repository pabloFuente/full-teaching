import { Comment } from './comment';
import { User } from './user';

export class Entry {

  public id?: number;
  public title: string;
  public date: Date;
  public comments: Comment[];
  public user: User;


}

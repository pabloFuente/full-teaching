import { User } from './user';

export class Comment {

  public id?: number;
  public message: string;
  public date: Date;
  public replies: Comment[];
  public user: User;
  
}

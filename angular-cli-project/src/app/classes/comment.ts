import { User } from './user';

export class Comment {
  constructor(
    public user: User,
    public message: string,
    public date: Date,
    public replies: Comment[]) { }
}

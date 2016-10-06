import { Comment } from './comment';
import { User } from './user';

export class Entry {

  constructor(
    public title: string,
    public comments: Comment[],
    public user: User) {}
}

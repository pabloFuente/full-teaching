import { Session } from './session';
import { Forum } from './forum';
import { User } from './user';

export class Course {
  constructor(
    public title: string,
    public teacher: User,
    public sessions: Session[],
    public fourm: Forum,
    public files: string[],
    public attenders: User[]) { }
}

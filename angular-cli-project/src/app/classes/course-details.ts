import { Session } from './session';
import { Forum } from './forum';
import { User } from './user';

export class CourseDetails {
  constructor(
    public sessions: Session[],
    public forum: Forum,
    public files: string[],
    public attenders: User[]) { }
}

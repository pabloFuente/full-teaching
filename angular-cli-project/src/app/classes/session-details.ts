import { Session } from './session';
import { Forum } from './forum';
import { User } from './user';

export class SessionDetails {
  constructor(
    public session: Session,
    public forum: Forum,
    public files: string[],
    public attenders: User[]) { }
}

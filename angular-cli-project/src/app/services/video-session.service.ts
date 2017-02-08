import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Session } from '../classes/session';
import { User } from '../classes/user';

@Injectable()
export class VideoSessionService {

  session: Session;
  courseAttenders: User[];

  constructor() { }

}

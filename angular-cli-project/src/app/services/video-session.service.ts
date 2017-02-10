import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Session } from '../classes/session';
import { Course } from '../classes/course';

@Injectable()
export class VideoSessionService {

  session: Session;
  course: Course;

  constructor() { }

}

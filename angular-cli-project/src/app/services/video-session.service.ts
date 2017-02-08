import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Session } from '../classes/session'

@Injectable()
export class VideoSessionService {

  session: Session;

  constructor() { }

}

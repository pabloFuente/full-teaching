import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Lesson } from './lesson';

@Injectable()
export class LessonService {

  private lessonsUrl = 'app/lessons';

  constructor(private http: Http) { }

  getLessons(): Promise<Lesson[]> {
    return this.http.get(this.lessonsUrl)
      .toPromise()
      .then(response => response.json().data as Lesson[])
      .catch(e => console.log(e));
  }

}

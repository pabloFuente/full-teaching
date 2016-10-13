import { Session }        from './session';
import { Forum }          from './forum';
import { User }           from './user';
import { CourseDetails }  from './course-details';

export class Course {
  constructor(
    public title: string,
    public teacher: User,
    public image: string,
    public courseDetails: CourseDetails) { }
}

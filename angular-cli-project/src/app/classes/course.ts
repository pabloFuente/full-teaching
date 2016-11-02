import { Session }        from './session';
import { Forum }          from './forum';
import { User }           from './user';
import { CourseDetails }  from './course-details';

export class Course {

  public id?: number;
  public title: string;
  public image: string;
  public teacher: User;
  public courseDetails: CourseDetails;
  public sessions: Session[];
  public attenders: User[];

  constructor(title: string, image: string, courseDetails: CourseDetails){
    this.title = title;
    this.teacher = undefined;
    this.image = image;
    this.courseDetails = courseDetails;
    this.sessions = [];
    this.attenders = [];
  }

}

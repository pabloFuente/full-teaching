import { Course }     from './course';
import { Session }    from './session';
import { Forum }      from './forum';
import { User }       from './user';
import { FileGroup }  from './file-group';

export class CourseDetails {

  public id?: number;
  public forum: Forum;
  public files: FileGroup[];
  public course: Course;


}

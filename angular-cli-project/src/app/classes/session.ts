import { Course } from './course';

export class Session {

  public id?: number;
  public title: string;
  public description: string;
  public date: Date;
  public course: Course;

  constructor(title: string, description: string, date: Date, course: Course){
    this.title = title;
    this.description = description;
    this.date = date;this.course = course;
  }

}

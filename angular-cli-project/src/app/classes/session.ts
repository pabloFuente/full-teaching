import { Course } from './course';

export class Session {

  public id?: number;
  public title: string;
  public description: string;
  public date: number;
  public course: Course;

  constructor(title: string, description: string, date: number){
    this.title = title;
    this.description = description;
    this.date = date;
    this.course = null; //Backend will take care of it
  }

}

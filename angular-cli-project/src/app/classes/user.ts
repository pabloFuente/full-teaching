import { Course } from './course';

export class User {

  public id?: number;
  public name: string;
  public nickName: string;
  public roles: string[];
  public picture: string;
  public registrationDate: Date;
  public passwordHash?: string;
  public courses: Course[];

  constructor(u: User){
    this.id = u.id;
    this.name = u.name;
    this.nickName = u.nickName;
    this.roles = u.roles;
    this.picture = u.picture;
    this.registrationDate = u.registrationDate;
    this.courses = [];
  }

}

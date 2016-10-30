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

}

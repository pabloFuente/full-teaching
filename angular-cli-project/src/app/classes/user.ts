import { Course } from './course';

export class User {

  public id?: number;
  public email: string;
  public name: string;
  public roles: string[];
  public picture: string;
  public registrationDate: Date;
  public passwordHash?: string;
  public courses: Course[];

}

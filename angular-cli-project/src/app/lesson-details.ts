import { Lesson } from './lesson';
import { User } from './user';

export class LessonDetails {
  constructor(
    public lesson: Lesson,
    public forum: string,
    public files: string[],
    public attenders: User[]) { }
}

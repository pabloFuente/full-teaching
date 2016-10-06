import { Lesson } from './lesson';
import { Forum } from './forum';
import { User } from './user';

export class LessonDetails {
  constructor(
    public lesson: Lesson,
    public forum: Forum,
    public files: string[],
    public attenders: User[]) { }
}

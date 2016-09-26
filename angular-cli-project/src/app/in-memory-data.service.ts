import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let lessons = [
      { title: "Lesson 1: Introduction to Web", description: 'This is a nice description about this lesson.', date: new Date("October 13, 2016 11:30:00") },
      { title: "Examples", description: 'This is a nice description about this lesson.', date: new Date("November 5, 2016 12:30:00") },
      { title: "Project configuration", description: 'This is a nice description about this lesson.', date: new Date("October 22, 2016 17:45:00") },
      { title: "Lesson 3: New technologies", description: 'This is a nice description about this lesson.', date: new Date("November 1, 2016 11:30:00") },
      { title: "Lesson 2: Database integration", description: 'This is a nice description about this lesson.', date: new Date("October 15, 2016 13:00:00") },
    ];
    return { lessons };
  }
}

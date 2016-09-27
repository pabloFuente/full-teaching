import { Component, OnInit } from '@angular/core';

import { Lesson } from './lesson';

import { LessonService } from './lesson.service';
import { LoginService } from './login.service';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [LessonService, LoginService],
})
export class DashboardComponent implements OnInit {

  lessons: Lesson[];

  constructor(private lessonService: LessonService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.checkCredentials();
    this.getLessons();
  }

  logout() {
    this.loginService.logout();
  }

  getLessons(): void {
    this.lessonService.getLessons().then(lessons => {
      lessons.sort((l1, l2) => {
        if (l1.date > l2.date) {
          return 1;
        }
        if (l1.date < l2.date) {
          return -1;
        }
        return 0;
      });
      this.lessons = lessons;
    });
  }

}

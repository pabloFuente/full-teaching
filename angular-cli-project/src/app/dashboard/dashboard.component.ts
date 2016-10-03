import { Component, OnInit } from '@angular/core';

import { Lesson } from '../lesson';

import { LessonService } from '../services/lesson.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  lessons: Lesson[];

  constructor(private lessonService: LessonService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.checkCredentials();
    this.getLessons();
  }

  logout() {
    this.authenticationService.logout();
  }

  getLessons(): void {
    this.lessonService.getLessons().subscribe(
      lessons => {
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
      },
      error => console.log(error));
  }

}

import { Component, OnInit } from '@angular/core';

import { Lesson } from '../lesson';

import { LessonService } from '../services/lesson.service';
import { AuthenticationService } from '../services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  lessons: Lesson[];

  //Collapsible components info
  view: number = 0;
  collapsibleTrigger: string = 'collapsibleTrigger_';
  collapsibleElement: string = 'collapsibleElement_';

  constructor(
    private lessonService: LessonService,
    private authenticationService: AuthenticationService,
  ) { }

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

  /*Triggers the particular collapsible body given by "id" parameter to show "option"
  view (0: forum, 1: files). This method uses two jQuery sentences*/
  triggerCollapsible(id: string, option: number) {
    let aux = this.view;
    switch (option) {
      case 0:
        this.view = 0;
        break;
      case 1:
        this.view = 1;
        break;
    }
    let el1 = $('#' + this.collapsibleElement + id);
    let el2 = $('#' + this.collapsibleTrigger + id);
    if (!el1.hasClass('active') || aux == option) el2.click();
  }

}

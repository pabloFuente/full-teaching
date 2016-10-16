import { Component, OnInit }  from '@angular/core';
import { Router } from '@angular/router';

import { Course }         from '../../classes/course';

import { CalendarComponent } from '../calendar/calendar.component';

import { CourseService }            from '../../services/course.service';
import { AuthenticationService }    from '../../services/authentication.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  courses: Course[];

  constructor(
    private courseService: CourseService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authenticationService.checkCredentials();
    this.getCourses();
  }

  goToCourseDetail(id): void {
    this.router.navigate(['/courses', id]);
  }

  logout() {
    this.authenticationService.logout();
  }

  getCourses(): void {
    console.log(this.authenticationService.getCurrentUser());
    this.courseService.getCourses().subscribe(
      courses => {
        console.log(courses);
        this.courses = courses;
      },
      error => console.log(error));
  }


  getImage(c: Course) {
    if (c.image) {
      return c.image;
    }
    else {
      return c.teacher.picture;
    }
  }

}

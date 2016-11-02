import { Component, OnInit, EventEmitter }  from '@angular/core';
import { Router } from '@angular/router';

import { Course }         from '../../classes/course';
import { CourseDetails }         from '../../classes/course-details';
import { Session }         from '../../classes/session';

import { CalendarComponent } from '../calendar/calendar.component';

import { CourseService }            from '../../services/course.service';
import { AuthenticationService }    from '../../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  courses: Course[];

  //Course modal data
  private inputCourseName: string;

  private actions1 = new EventEmitter<string>();

  constructor(
    private courseService: CourseService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authenticationService.checkCredentials();
    //this.courses = this.authenticationService.getCurrentUser().courses;
    //One more interaction with the database!
    this.getCourses();
  }

  goToCourseDetail(id): void {
    this.router.navigate(['/courses', id]);
  }

  logout() {
    this.authenticationService.logOut();
  }

  getCourses(): void {
    this.courseService.getCourses(this.authenticationService.getCurrentUser()).subscribe(
      courses => {
        console.log(courses);
        this.authenticationService.getCurrentUser().courses = courses;
        this.courses = courses;
      },
      error => console.log(error));
  }


  getImage(c: Course) {
    if (c.image) {
      return c.image;
    }
    else {
      //return c.teacher.picture;
      return "/../assets/images/default_session_image.png";
    }
  }

  onCourseSubmit() {
    let newCourse = new Course(this.inputCourseName, this.authenticationService.getCurrentUser(), this.authenticationService.getCurrentUser().picture, undefined);
    newCourse.courseDetails = new CourseDetails(newCourse, undefined, []);
    this.courses.push(newCourse);
    this.actions1.emit("closeModal");
  }

}

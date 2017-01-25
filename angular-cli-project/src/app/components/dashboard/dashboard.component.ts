import { Component, OnInit, EventEmitter }  from '@angular/core';
import { Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { Course }         from '../../classes/course';
import { CourseDetails }  from '../../classes/course-details';
import { Session }        from '../../classes/session';
import { Forum }          from '../../classes/forum';

import { CalendarComponent } from '../calendar/calendar.component';

import { CourseService }            from '../../services/course.service';
import { AuthenticationService }    from '../../services/authentication.service';
import { AnimationService }      from '../../services/animation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  courses: Course[];

  //POST MODAL
  processingPost: boolean = false;
  inputPostCourseName: string;

  //PUT-DELETE MODAL
  processingPut: boolean = false;
  inputPutCourseName: string;
  inputPutCourseImage: string;
  updatedCourse: Course;
  allowCourseDeletion: boolean = false;

  actions1 = new EventEmitter<string|MaterializeAction>();
  actions4 = new EventEmitter<string|MaterializeAction>();

  constructor(
    private courseService: CourseService,
    private authenticationService: AuthenticationService,
    private animationService: AnimationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.authenticationService.checkCredentials();
    //this.courses = this.authenticationService.getCurrentUser().courses;
    //One more interaction with the database!
    this.getCourses();
  }

  goToCourseDetail(id): void {
    this.router.navigate(['/courses', id, 0]);
  }

  logout() {
    this.authenticationService.logOut();
  }

  getCourses(): void {
    this.courseService.getCourses(this.authenticationService.getCurrentUser()).subscribe(
      courses => {
        console.log("User's courses: ");
        console.log(courses);
        this.authenticationService.getCurrentUser().courses = courses;
        this.courses = courses;
        if(this.courses.length > 0) this.updatedCourse = this.courses[0];
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

  //POST new Course
  onCourseSubmit() {
    this.processingPost = true;

    let newForum = new Forum(true);
    let newCourseDetails = new CourseDetails(newForum, []);
    let newCourse = new Course(this.inputPostCourseName, this.authenticationService.getCurrentUser().picture, newCourseDetails);
    console.log(JSON.stringify(newCourse));
    this.courseService.newCourse(newCourse).subscribe(
      course => {
        console.log("New course added: ");
        console.log(course);
        this.courses.push(course);

        this.processingPost = false;
        this.actions1.emit({action:"modal",params:['close']});
      },
      error => {console.log(error); this.processingPost = false;}
    )
  }

  //PUT existing Course
  onPutDeleteCourseSubmit(){
    this.processingPut = true;

    let c: Course = new Course(this.inputPutCourseName, this.updatedCourse.image, this.updatedCourse.courseDetails);
    c.id = this.updatedCourse.id;
    console.log(c);
    this.courseService.editCourse(c).subscribe(
      response => {
        console.log("Course modified: ");
        console.log(response);
        //Only on succesful put we locally update the modified course
        for (let i = 0; i < this.courses.length; i++) {
          if (this.courses[i].id == response.id) {
            this.courses[i] = response; //The session with the required ID is updated
            this.updatedCourse = this.courses[i];
            break;
          }
        }

        this.processingPut = false;
        this.actions4.emit({action:"modal",params:['close']});
      },
      error => {console.log(error); this.processingPut = false;}
    )
  }

  //DELETE existing Course
  deleteCourse() {
    this.courseService.deleteCourse(this.updatedCourse.id).subscribe(
      response => {
        console.log("Course deleted");
        console.log(response);
        //Only on succesful put we locally delete the course
        for (let i = 0; i < this.courses.length; i++) {
          if (this.courses[i].id == response.id) {
            this.courses.splice(i, 1); //The course with the required ID is deleted
            this.updatedCourse = this.courses[0];
            break;
          }
        }
        this.actions4.emit({action:"modal",params:['close']});
      },
      error => console.log(error)
    );
  }

  changeUpdatedCourse(course: Course) {
    this.updatedCourse = course;
    this.inputPutCourseName = this.updatedCourse.title;
  }

}

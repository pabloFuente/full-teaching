import { Component, OnInit, OnChanges, Input, EventEmitter, trigger, state, animate, transition, style } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Subscription }             from 'rxjs/Subscription';

import { CommentComponent } from '../comment/comment.component';

import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';
import { CourseService }         from '../../services/course.service';
import { ForumService }          from '../../services/forum.service';
import { AuthenticationService } from '../../services/authentication.service';

import { Session }       from '../../classes/session';
import { Course }        from '../../classes/course';
import { Entry }         from '../../classes/entry';
import { Comment }       from '../../classes/comment';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  animations: [
    trigger('fadeAnim', [
      state('commentsShown', style({
        opacity: 1
      })),
      state('commentsHidden', style({
        opacity: 0.2
      })),
      transition('commentsHidden => commentsShown', animate('.4s')),
      transition('commentsShown => commentsHidden', animate('.1s')),
    ]),
  ]
})
export class CourseDetailsComponent implements OnInit {

  course: Course;

  selectedEntry: Entry;

  fadeAnim = 'commentsHidden';

  inputTitle: string;
  inputComment: string;
  inputDate: Date;
  inputTime: string;
//courseDetailsModalMode: 0 -> New entry | 1 -> New comment | 2 -> New replay | 3 -> New session | 4 -> Add attenders
  courseDetailsModalMode: number = 3;
  courseDetailsModalEntry: Entry;
  courseDetailsModalCommentReplay: Comment;

  private actions2 = new EventEmitter<string>();

  subscription: Subscription;

  constructor(
    private courseService: CourseService,
    private forumService: ForumService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private courseDetailsModalDataService: CourseDetailsModalDataService) {
    this.subscription = courseDetailsModalDataService.modeAnnounced$.subscribe(
      objs => {
        //objs is an array containing courseDetailsModalMode, courseDetailsModalEntry and courseDetailsModalCommentReplay, in that specific order
        this.courseDetailsModalMode = objs[0];
        if (objs[1]) this.courseDetailsModalEntry = objs[1]; //Only if the string is not empty
        if (objs[2]) this.courseDetailsModalCommentReplay = objs[2]; //Only if the string is not empty
      });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = +params['id'];
      this.courseService.getCourse(id).subscribe(
        course => {
          console.log("Course " + course.id + ":");
          console.log(course);
          this.course = course;
          this.selectedEntry = this.course.courseDetails.forum.entries[0];
        },
        error => console.log(error));
    });
  }

  updateCourseDetailsModalMode(mode: number, header: Entry, commentReplay: Comment) {
    let objs = [mode, header, commentReplay];
    this.courseDetailsModalDataService.announceMode(objs);
  }

  getLastEntryComment(entry: Entry){
    let comment = entry.comments[0];
    for (let c of entry.comments){
      if (c.date > comment.date) comment = c;
    }
    return comment;
  }

  isCurrentMode(possibleModes: string[]): boolean {
    return (possibleModes.indexOf(this.courseDetailsModalMode.toString()) > -1);
  }

  onCourseDetailsSubmit() {

    //If modal is opened in "New Entry" mode
    if (this.courseDetailsModalMode === 0) {
      console.log("Saving new Entry: Title -> " + this.inputTitle + "  |  Comment -> " + this.inputComment);
      let e = new Entry(this.inputTitle, [new Comment(this.inputComment, null)]);

      this.forumService.newEntry(e, this.course.courseDetails.forum.id).subscribe( //POST method requires an Entry and the Forum id which it belongs
        response  => {
          console.log(response);
          this.course.courseDetails.forum = response; //Only on succesful post we update the modified forum
          this.actions2.emit("closeModal");
        },
        error => console.log(error)
      );
    }

    //If modal is opened in "New Session" mode
    else if (this.courseDetailsModalMode === 3) {
      let date = new Date(this.inputDate);
      let hoursMins = this.inputTime.split(":");
      date.setHours(parseInt(hoursMins[0]), parseInt(hoursMins[1]));
      let s = new Session(this.inputTitle, this.inputComment, date, this.course.courseDetails.course);
      this.course.courseDetails.course.sessions.push(s);
      this.actions2.emit("closeModal");
    }

    //If modal is opened in "New Comment" mode (replaying or not replaying)
    else {
      let c = new Comment(this.inputComment, this.courseDetailsModalCommentReplay);
      console.log(c);
      this.forumService.newComment(c, this.selectedEntry.id).subscribe(
        response => {
          console.log(response);
          //Only on succesful post we locally update the entry
          let ents = this.course.courseDetails.forum.entries;
          for (let i = 0; i < ents.length; i++) {
            if (ents[i].id == this.selectedEntry.id) {
              this.course.courseDetails.forum.entries[i] = response; //The entry with the required ID is updated
              this.selectedEntry = this.course.courseDetails.forum.entries[i];
              break;
            }
          }
          this.actions2.emit("closeModal");
        },
        error => console.log(error)
      );
    }
  }

}

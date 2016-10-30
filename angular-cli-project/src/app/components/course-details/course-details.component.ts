import { Component, OnInit, OnChanges, Input, EventEmitter, trigger, state, animate, transition, style } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Subscription }             from 'rxjs/Subscription';

import { CommentComponent } from '../comment/comment.component';

import { CourseDetailsModalDataService } from '../../services/course-details-modal-data.service';
import { CourseService }         from '../../services/course.service';
import { AuthenticationService } from '../../services/authentication.service';

import { Session }       from '../../classes/session';
import { CourseDetails } from '../../classes/course-details';
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

  courseDetails: CourseDetails;

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
      this.courseService.getCourseDetails(id).subscribe(
        courseDetails => {
          console.log(courseDetails);
          this.courseDetails = courseDetails;
          this.selectedEntry = this.courseDetails.forum.entries[0];
        },
        error => console.log(error));
    });
  }

  updateCourseDetailsModalMode(mode: number, header: Entry, commentReplay: Comment) {
    let objs = [mode, header, commentReplay];
    this.courseDetailsModalDataService.announceMode(objs);
  }

  getLastEntrytComment(entry: Entry){
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
      let e = new Entry(this.inputTitle, [new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), [])], new Date(), this.authenticationService.getCurrentUser());
      console.log(e);

      /*this.forumService.newEntry(e, this.lessonDetails.lesson).suscribe( //POST method requires an Entry and the Lesson (its forum) which it belongs
        response => */this.courseDetails.forum.entries.push(e); this.actions2.emit("closeModal");//Only on succesful post we locally save the new entry
      /*error =>
    );*/
    }
    //If modal is opened in "New Session" mode
    else if (this.courseDetailsModalMode === 3) {
      let date = new Date(this.inputDate);
      let hoursMins = this.inputTime.split(":");
      date.setHours(parseInt(hoursMins[0]), parseInt(hoursMins[1]));
      let s = new Session(this.inputTitle, this.inputComment, date, this.courseDetails.course);
      this.courseDetails.course.sessions.push(s);
      this.actions2.emit("closeModal");
    }
    //If modal is opened in "New Comment" mode (replaying or not replaying)
    else {
      let c = new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), []);
      /*this.forumService.newComment(c, this.courseDetailsModalEntry, this.courseDetailsModalCommentReplay).suscribe( //POST method requires the Comment, the ENtry which it belongs and the replayed comment
        response =>*/if (this.courseDetailsModalMode === 2) { //Only on succesful post we locally save the new comment
        this.courseDetailsModalCommentReplay.replies.push(c);
      }
      else {
        this.courseDetailsModalEntry.comments.push(c);
      }
      this.actions2.emit("closeModal");
      /*error =>
    );*/
    }
  }

}

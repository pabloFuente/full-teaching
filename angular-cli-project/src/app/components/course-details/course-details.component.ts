import { Component, OnInit, OnChanges, Input, EventEmitter, trigger, state, animate, transition, style } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Subscription }             from 'rxjs/Subscription';

import { CommentComponent } from '../comment/comment.component';

import { ForumModalDataService } from '../../services/forum-modal-data.service';
import { CourseService }         from '../../services/course.service';
import { AuthenticationService } from '../../services/authentication.service';

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

  fadeAnim = 'commentsShown';

  //Forum Modal Data
  inputTitle: string;
  inputComment: string;
  forumModalMode: number; // 0 -> New entry | 1 -> New comment | 2 -> New replay
  forumModalEntry: Entry;
  forumModalCommentReplay: Comment;

  private actions2 = new EventEmitter<string>();

  subscription: Subscription;

  constructor(
    private courseService: CourseService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private forumModalDataService: ForumModalDataService) {
    this.subscription = forumModalDataService.modeAnnounced$.subscribe(
      objs => {
        //objs is an array containing forumModalMode, forumModalEntry and forumModalCommentReplay, in that specific order
        this.forumModalMode = objs[0];
        if (objs[1]) this.forumModalEntry = objs[1]; //Only if the string is not empty
        if (objs[2]) this.forumModalCommentReplay = objs[2]; //Only if the string is not empty
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

  updateForumModalMode(mode: number, header: string, commentReplay: string) {
    let objs = [mode, header, commentReplay];
    this.forumModalDataService.announceMode(objs);
  }

  onForumSubmit() {
    //If modal is opened in "New Entry" mode
    if (this.forumModalMode === 0) {
      console.log("Saving new Entry: Title -> " + this.inputTitle + "  |  Comment -> " + this.inputComment);
      let e = new Entry(this.inputTitle, [new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), [])], new Date(), this.authenticationService.getCurrentUser());
      console.log(e);

      /*this.forumService.newEntry(e, this.lessonDetails.lesson).suscribe( //POST method requires an Entry and the Lesson (its forum) which it belongs
        response => */this.courseDetails.forum.entries.push(e); this.actions2.emit("closeModal");//Only on succesful post we locally save the new entry
      /*error =>
    );*/
    }
    //If modal is opened in "New Comment" mode (replaying or not replaying)
    else {
      let c = new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), []);
      /*this.forumService.newComment(c, this.forumModalEntry, this.forumModalCommentReplay).suscribe( //POST method requires the Comment, the ENtry which it belongs and the replayed comment
        response =>*/if (this.forumModalMode === 2) { //Only on succesful post we locally save the new comment
        this.forumModalCommentReplay.replies.push(c);
      }
      else {
        this.forumModalEntry.comments.push(c);
      }
      this.actions2.emit("closeModal");
      /*error =>
    );*/
    }
  }

}

import { Component, OnInit, EventEmitter }  from '@angular/core';
import { Subscription }                     from 'rxjs/Subscription';

import { LessonDetailsComponent } from '../lesson-details/lesson-details.component';

import { Lesson }         from '../../classes/lesson';
import { LessonDetails }  from '../../classes/lesson-details';
import { Entry }          from '../../classes/entry';
import { Comment }          from '../../classes/comment';

import { LessonService }            from '../../services/lesson.service';
import { AuthenticationService }    from '../../services/authentication.service';
import { ForumModalDataService }    from '../../services/forum-modal-data.service';
import { ForumService }             from '../../services/forum.service';

declare var $: any;

@Component({
  selector: 'app-dashboard',
  providers: [ForumModalDataService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  lessons: Lesson[];
  lessonDetails: LessonDetails;

  lessonDetailsActive: number = -1;

  //Forum modal data
  inputTitle: string;
  inputComment: string;
  forumModalMode: number; // 0: New entry | 1: New comment on an entry | 2: New replay to existing comment
  forumModalEntry: Entry;
  forumModalCommentReplay: Comment;

  //Collapsible components HTML info
  collapsibleTrigger: string = 'collapsibleTrigger_';
  collapsibleElement: string = 'collapsibleElement_';
  iconTrigger: string = 'iconTrigger_';

  actions2 = new EventEmitter<string>();

  subscription: Subscription;

  constructor(
    private lessonService: LessonService,
    private authenticationService: AuthenticationService,
    private forumModalEntryService: ForumModalDataService,
    private forumService: ForumService,
  ) {
    this.subscription = forumModalEntryService.modeAnnounced$.subscribe(
      objs => {
        //Objs is an array containing forumModalMode, forumModalEntry and forumModalCommentReplay, in that order
        this.forumModalMode = objs[0];
        if (objs[1]) this.forumModalEntry = objs[1]; //Only if the string is not empty
        if (objs[2]) this.forumModalCommentReplay = objs[2]; //Only if the string is not empty
      });
  }

  ngOnInit(): void {
    this.authenticationService.checkCredentials();
    this.getLessons();
  }

  logout() {
    this.authenticationService.logout();
  }

  getLessons(): void {
    console.log(this.authenticationService.getCurrentUser());
    this.lessonService.getLessons(this.authenticationService.getCurrentUser().email).subscribe(
      lessons => {
        console.log(lessons);
        lessons.sort((l1, l2) => { //Sort lessons by date
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

  getLessonDetails(id: string): void {
    this.lessonService.getLessonDetails(id).subscribe(
      lessonDetails => {
        console.log(lessonDetails);
        this.lessonDetails = lessonDetails;
        $('#' + this.iconTrigger + id).removeClass('loading-details'); //Petition animation deactivated
        this.fireClickOnCollapsible(id); //Click event on collapsible to activate it
      },
      error => console.log(error));
  }



  triggerLessonDetails(id: string) {

    // If there's no lesson-detail active or if a different one is going to be activated
    if (this.lessonDetailsActive == -1 || this.lessonDetailsActive != +id) {
      $('#' + this.iconTrigger + id).addClass('loading-details'); //Petition animation activated
      this.getLessonDetails(id);      //Petition for specific lesson-details
    }

    // If an active lesson-detail is going to be closed
    else {
      $('#' + this.collapsibleElement + this.lessonDetailsActive).removeClass('active'); //Removed active class from the collapsible
      $('#' + this.collapsibleTrigger + id).prop("checked", false); //The input is unchecked
      this.lessonDetailsActive = -1;   //No lesson-details view active
    }
  }

  fireClickOnCollapsible(id) {
    $('#' + this.collapsibleTrigger + id).prop("checked", true); //The input is checked
    $('#' + this.collapsibleElement + id).addClass('active'); // Its container is activated
    $('#' + this.collapsibleElement + this.lessonDetailsActive).removeClass('active'); //Previous collapsible is not activated
    this.lessonDetailsActive = +id; //New lesson-details view active
  }

  onSubmit(){
    //If modal is opened in "New Entry" mode
    if (this.forumModalMode === 0){
      console.log("Saving new Entry: Title -> " + this.inputTitle + "  |  Comment -> " + this.inputComment);
      let e = new Entry(this.inputTitle, [new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), [])], new Date(), this.authenticationService.getCurrentUser());
      console.log(e);

      /*this.forumService.newEntry(e, this.lessonDetails.lesson).suscribe( //POST method requires an Entry and the Lesson (its forum) which it belongs
        response => */this.lessonDetails.forum.entries.push(e); this.actions2.emit("closeModal");//Only on succesful post we locally save the new entry
        /*error =>
      );*/
    }
    //If modal is opened in "New Comment" mode (replaying or not replaying)
    else {
      let c = new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), []);
      /*this.forumService.newComment(c, this.forumModalEntry, this.forumModalCommentReplay).suscribe( //POST method requires the Comment, the ENtry which it belongs and the replayed comment
        response =>*/if (this.forumModalMode === 2){ //Only on succesful post we locally save the new comment
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

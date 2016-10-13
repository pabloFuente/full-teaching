import { Component, OnInit, EventEmitter }  from '@angular/core';
import { Subscription }                     from 'rxjs/Subscription';

import { SessionDetailsComponent } from '../session-details/session-details.component';

import { Session }         from '../../classes/session';
import { SessionDetails }  from '../../classes/session-details';
import { Entry }          from '../../classes/entry';
import { Comment }          from '../../classes/comment';

import { SessionService }            from '../../services/session.service';
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

  sessions: Session[];
  sessionDetails: SessionDetails;

  sessionDetailsActive: number = -1;

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
    private sessionService: SessionService,
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
    this.getSessions();
  }

  logout() {
    this.authenticationService.logout();
  }

  getSessions(): void {
    console.log(this.authenticationService.getCurrentUser());
    this.sessionService.getSessions(this.authenticationService.getCurrentUser().email).subscribe(
      sessions => {
        console.log(sessions);
        sessions.sort((l1, l2) => { //Sort sessions by date
          if (l1.date > l2.date) {
            return 1;
          }
          if (l1.date < l2.date) {
            return -1;
          }
          return 0;
        });
        this.sessions = sessions;
      },
      error => console.log(error));
  }

  getSessionDetails(id: string): void {;
    console.log("Getting details");
    this.sessionService.getSessionDetails(id).subscribe(
      sessionDetails => {
        console.log(sessionDetails);
        this.sessionDetails = sessionDetails;
        $('#' + this.iconTrigger + id).removeClass('loading-details'); //Petition animation deactivated
        this.fireClickOnCollapsible(id); //Click event on collapsible to activate it
      },
      error => console.log(error));
  }



  triggerSessionDetails(id: string) {

    // If there's no session-detail active or if a different one is going to be activated
    if (this.sessionDetailsActive == -1 || this.sessionDetailsActive != +id) {
      $('#' + this.iconTrigger + id).addClass('loading-details'); //Petition animation activated
      this.getSessionDetails(id);      //Petition for specific session-details
    }

    // If an active session-detail is going to be closed
    else {
      $('#' + this.collapsibleElement + this.sessionDetailsActive).removeClass('active'); //Removed active class from the collapsible
      $('#' + this.collapsibleTrigger + id).prop("checked", false); //The input is unchecked
      this.sessionDetailsActive = -1;   //No session-details view active
    }
  }

  fireClickOnCollapsible(id) {
    $('#' + this.collapsibleTrigger + id).prop("checked", true); //The input is checked
    $('#' + this.collapsibleElement + id).addClass('active'); // Its container is activated
    $('#' + this.collapsibleElement + this.sessionDetailsActive).removeClass('active'); //Previous collapsible is not activated
    this.sessionDetailsActive = +id; //New session-details view active
  }

  onSubmit(){
    //If modal is opened in "New Entry" mode
    if (this.forumModalMode === 0){
      console.log("Saving new Entry: Title -> " + this.inputTitle + "  |  Comment -> " + this.inputComment);
      let e = new Entry(this.inputTitle, [new Comment(this.authenticationService.getCurrentUser(), this.inputComment, new Date(), [])], new Date(), this.authenticationService.getCurrentUser());
      console.log(e);

      /*this.forumService.newEntry(e, this.sessionDetails.session).suscribe( //POST method requires an Entry and the Session (its forum) which it belongs
        response => */this.sessionDetails.forum.entries.push(e); this.actions2.emit("closeModal");//Only on succesful post we locally save the new entry
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { routing } from './app.routing';

import { MaterializeModule }   from 'angular2-materialize';
import { FileSelectDirective } from 'ng2-file-upload';
import { FileDropDirective }   from 'ng2-file-upload';

import { MaterialModule } from '@angular/material';

import { AppComponent }           from './app.component';
import { NavbarComponent }        from './components/navbar/navbar.component';
import { LoginModalComponent }    from './components/login-modal/login-modal.component';
import { PresentationComponent }  from './components/presentation/presentation.component';
import { DashboardComponent }     from './components/dashboard/dashboard.component';
import { CourseDetailsComponent } from './components/course-details/course-details.component'
import { SettingsComponent }      from './components/settings/settings.component';
import { ErrorMessageComponent }  from './components/error-message/error-message.component';
import { CommentComponent }       from './components/comment/comment.component';
import { FileGroupComponent }     from './components/file-group/file-group.component';

import { AuthenticationService }  from './services/authentication.service';
import { CourseService }          from './services/course.service';
import { SessionService }         from './services/session.service';
import { ForumService }           from './services/forum.service';
import { FileService }            from './services/file.service';
import { CourseDetailsModalDataService }  from './services/course-details-modal-data.service';
import { LoginModalService }      from './services/login-modal.service';
import { UserService }            from './services/user.service';
import { AuthGuard }              from './auth.guard';
import { Constants }              from './constants';

import { CalendarModule }         from 'angular-calendar';
import { CalendarComponent }      from './components/calendar/calendar.component';
import { TimeAgoPipe }            from 'time-ago-pipe';
import { DragulaModule }          from 'ng2-dragula/ng2-dragula';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterializeModule,
    MaterialModule.forRoot(),
    routing,
    CalendarModule.forRoot(),
    DragulaModule,
  ],
  declarations: [
    AppComponent,
    PresentationComponent,
    DashboardComponent,
    CourseDetailsComponent,
    NavbarComponent,
    LoginModalComponent,
    SettingsComponent,
    ErrorMessageComponent,
    CommentComponent,
    FileGroupComponent,
    CalendarComponent,
    TimeAgoPipe,
    FileSelectDirective,
    FileDropDirective,
  ],
  providers: [
    AuthenticationService,
    CourseService,
    SessionService,
    ForumService,
    FileService,
    CourseDetailsModalDataService,
    LoginModalService,
    UserService,
    AuthGuard,
    Constants,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

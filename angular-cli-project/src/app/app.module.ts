import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { routing } from './app.routing';

import { MaterializeModule } from 'angular2-materialize';

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

import { AuthenticationService }  from './services/authentication.service';
import { CourseService }          from './services/course.service';
import { SessionService }         from './services/session.service';
import { ForumService }           from './services/forum.service';
import { ForumModalDataService }  from './services/forum-modal-data.service';
import { LoginModalService }      from './services/login-modal.service';
import { AuthGuard }              from './auth.guard';
import { Constants }              from './constants';

import { CalendarModule } from 'angular2-calendar';
import { CalendarComponent } from './components/calendar/calendar.component';

// used to create fake backend
import { fakeBackendProvider }         from './fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions }          from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterializeModule,
    MaterialModule.forRoot(),
    routing,
    CalendarModule.forRoot(),
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
    CalendarComponent,
  ],
  providers: [
    AuthenticationService,
    CourseService,
    SessionService,
    ForumService,
    ForumModalDataService,
    LoginModalService,
    AuthGuard,
    Constants,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

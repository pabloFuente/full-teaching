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
import { LessonDetailsComponent } from './components/lesson-details/lesson-details.component'
import { SettingsComponent }      from './components/settings/settings.component';
import { ErrorMessageComponent }  from './components/error-message/error-message.component';
import { CommentComponent }       from './components/comment/comment.component';

import { AuthenticationService }  from './services/authentication.service';
import { LessonService }          from './services/lesson.service';
import { ForumService }           from './services/forum.service';
import { LoginModalService }      from './services/login-modal.service';
import { AuthGuard }              from './auth.guard';
import { Constants }              from './constants';

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
  ],
  declarations: [
    AppComponent,
    PresentationComponent,
    DashboardComponent,
    LessonDetailsComponent,
    NavbarComponent,
    LoginModalComponent,
    SettingsComponent,
    ErrorMessageComponent,
    CommentComponent,
  ],
  providers: [
    AuthenticationService,
    LessonService,
    ForumService,
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

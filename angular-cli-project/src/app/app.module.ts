import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';
import { LoginModalComponent } from './login-modal.component';
import { PresentationComponent } from './presentation.component';
import { DashboardComponent } from './dashboard.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from './auth.guard';

// used to create fake backend
import { fakeBackendProvider } from './fake-backend';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterializeModule,
    routing,
  ],
  declarations: [
    AppComponent,
    PresentationComponent,
    DashboardComponent,
    NavbarComponent,
    LoginModalComponent,
  ],
  providers: [
    AuthenticationService,
    AuthGuard,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar.component';
import { LoginModalComponent } from './login-modal.component';
import { PresentationComponent } from './presentation.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    PresentationComponent,
    DashboardComponent,
    NavbarComponent,
    LoginModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    MaterializeModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

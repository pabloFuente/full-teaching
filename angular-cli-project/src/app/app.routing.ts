import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent }    from './components/presentation/presentation.component';
import { DashboardComponent }       from './components/dashboard/dashboard.component';
import { CourseDetailsComponent }   from './components/course-details/course-details.component';
import { SettingsComponent }        from './components/settings/settings.component';
import { VideoSessionComponent }    from './components/video-session/video-session.component';
import { AuthGuard }                from './auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
    pathMatch: 'full',
  },
  {
    path: 'courses',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courses/:id/:tabId',
    component: CourseDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'session/:id',
    component: VideoSessionComponent,
    canActivate: [AuthGuard]
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

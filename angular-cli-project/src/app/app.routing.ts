import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent }      from './presentation/presentation.component';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { SettingsComponent }      from './settings/settings.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

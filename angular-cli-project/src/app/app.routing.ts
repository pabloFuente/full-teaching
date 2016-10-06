import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent }      from './components/presentation/presentation.component';
import { DashboardComponent }      from './components/dashboard/dashboard.component';
import { SettingsComponent }      from './components/settings/settings.component';
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

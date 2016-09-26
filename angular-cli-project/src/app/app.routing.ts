import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresentationComponent }      from './presentation.component';
import { DashboardComponent }      from './dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PresentationComponent,
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

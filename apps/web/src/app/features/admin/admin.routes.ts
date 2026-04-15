import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./projects/admin-projects.component').then(
            (m) => m.AdminProjectsComponent,
          ),
      },
      {
        path: 'newsletters',
        loadComponent: () =>
          import('./newsletters/admin-newsletters.component').then(
            (m) => m.AdminNewslettersComponent,
          ),
      },
    ],
  },
];

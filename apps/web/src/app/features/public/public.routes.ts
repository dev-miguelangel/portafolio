import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./projects/projects.component').then(
            (m) => m.ProjectsComponent,
          ),
      },
      {
        path: 'proyectos/:id',
        loadComponent: () =>
          import('./projects/project-detail.component').then(
            (m) => m.ProjectDetailComponent,
          ),
      },
      {
        path: 'newsletter',
        loadComponent: () =>
          import('./newsletter/newsletter.component').then(
            (m) => m.NewsletterComponent,
          ),
      },
      {
        path: 'newsletter/:id',
        loadComponent: () =>
          import('./newsletter/newsletter-detail.component').then(
            (m) => m.NewsletterDetailComponent,
          ),
      },
    ],
  },
];

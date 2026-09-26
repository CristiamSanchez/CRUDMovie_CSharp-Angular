import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', loadComponent: () => import('./features/movie-list/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'movies/create', loadComponent: () => import('./features/movie-form/movie-form.component').then(m => m.MovieFormComponent) },
  { path: 'movies/:id', loadComponent: () => import('./features/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'movies/:id/edit', loadComponent: () => import('./features/movie-form/movie-form.component').then(m => m.MovieFormComponent) }
];
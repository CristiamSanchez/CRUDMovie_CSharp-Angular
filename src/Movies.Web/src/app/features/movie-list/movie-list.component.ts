import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { ModalService } from '../../shared/components/modal/modal.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly modalService = inject(ModalService);

  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading.set(true);
    this.error.set(null);

    this.movieService.getAll().subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load movies. Please try again.');
        this.loading.set(false);
        console.error('Error loading movies:', err);
      }
    });
  }

  openCreateModal(): void {
    this.modalService.open({
      component: MovieFormComponent,
      title: 'Create Movie',
      size: 'md',
      data: {
        isEditMode: false,
        movieId: null,
        onSave: (result: { id: number }) => this.loadMovies(),
        onCancel: () => {}
      } as Partial<MovieFormComponent>
    });
  }

  openEditModal(movie: Movie): void {
    this.modalService.open({
      component: MovieFormComponent,
      title: 'Edit Movie',
      size: 'md',
      data: {
        isEditMode: true,
        movieId: movie.id,
        onSave: (result: { id: number }) => this.loadMovies(),
        onCancel: () => {}
      } as Partial<MovieFormComponent>
    });
  }

  deleteMovie(id: number): void {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    this.deletingId.set(id);

    this.movieService.delete(id).subscribe({
      next: () => {
        this.movies.update(movies => movies.filter(m => m.id !== id));
        this.deletingId.set(null);
      },
      error: (err) => {
        this.error.set('Failed to delete movie. Please try again.');
        this.deletingId.set(null);
        console.error('Error deleting movie:', err);
      }
    });
  }

  viewMovie(movie: Movie): void {
    window.location.href = `/movies/${movie.id}`;
  }
}
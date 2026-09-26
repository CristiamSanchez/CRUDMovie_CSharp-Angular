import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

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

  deleteMovie(id: number): void {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    this.movieService.delete(id).subscribe({
      next: () => {
        this.movies.update(movies => movies.filter(m => m.id !== id));
      },
      error: (err) => {
        this.error.set('Failed to delete movie. Please try again.');
        console.error('Error deleting movie:', err);
      }
    });
  }
}
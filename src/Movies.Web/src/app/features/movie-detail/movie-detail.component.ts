import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent implements OnInit {
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  movie = signal<Movie | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  notFound = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadMovie(id);
    }
  }

  loadMovie(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);

    this.movieService.getById(id).subscribe({
      next: (movie) => {
        this.movie.set(movie);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Failed to load movie. Please try again.');
        }
        console.error('Error loading movie:', err);
      }
    });
  }

  deleteMovie(): void {
    const movie = this.movie();
    if (!movie) return;

    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      return;
    }

    this.movieService.delete(movie.id).subscribe({
      next: () => {
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.error.set('Failed to delete movie. Please try again.');
        console.error('Error deleting movie:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/movies']);
  }
}
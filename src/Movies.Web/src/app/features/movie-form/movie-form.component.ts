import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Genre, CreateMovieRequest, UpdateMovieRequest } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css'
})
export class MovieFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly movieService = inject(MovieService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  form: FormGroup;
  loading = signal(false);
  error = signal<string | null>(null);
  submitError = signal<string | null>(null);

  isEditMode = false;
  movieId: number | null = null;

  genres: Genre[] = ['Action', 'Comedy', 'Drama', 'Horror', 'SciFi', 'Documentary', 'Animation', 'Thriller', 'Romance', 'Other'];

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(2000)]],
      genre: ['', Validators.required],
      releaseYear: ['', [Validators.required, Validators.min(1888), Validators.max(2100)]],
      director: ['', [Validators.required, Validators.maxLength(100)]],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.movieId = Number(idParam);
      this.loadMovie(this.movieId);
    }
  }

  loadMovie(id: number): void {
    this.loading.set(true);
    this.movieService.getById(id).subscribe({
      next: (movie) => {
        this.form.patchValue({
          title: movie.title,
          description: movie.description,
          genre: movie.genre,
          releaseYear: movie.releaseYear,
          director: movie.director,
          rating: movie.rating
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.error.set('Movie not found.');
        } else {
          this.error.set('Failed to load movie. Please try again.');
        }
        console.error('Error loading movie:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.submitError.set(null);

    const formValue = this.form.value;
    const requestData: CreateMovieRequest | UpdateMovieRequest = {
      title: formValue.title,
      description: formValue.description,
      genre: formValue.genre,
      releaseYear: formValue.releaseYear,
      director: formValue.director,
      rating: formValue.rating
    };

    if (this.isEditMode && this.movieId) {
      this.movieService.update(this.movieId, requestData).subscribe({
        next: (movie) => {
          this.loading.set(false);
          this.router.navigate(['/movies', movie.id]);
        },
        error: (err) => {
          this.loading.set(false);
          this.submitError.set(this.extractErrorMessage(err));
          console.error('Error updating movie:', err);
        }
      });
    } else {
      this.movieService.create(requestData).subscribe({
        next: (movie) => {
          this.loading.set(false);
          this.router.navigate(['/movies', movie.id]);
        },
        error: (err) => {
          this.loading.set(false);
          this.submitError.set(this.extractErrorMessage(err));
          console.error('Error creating movie:', err);
        }
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.movieId) {
      this.router.navigate(['/movies', this.movieId]);
    } else {
      this.router.navigate(['/movies']);
    }
  }

  private extractErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'error' in err) {
      const error = (err as { error: unknown }).error;
      if (error && typeof error === 'object' && 'error' in error) {
        return (error as { error: string }).error;
      }
      if (error && typeof error === 'object' && 'message' in error) {
        return (error as { message: string }).message;
      }
    }
    return 'An error occurred. Please try again.';
  }

  getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return `${this.getFieldLabel(fieldName)} is required.`;
      }
      if (control.errors?.['minlength']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters.`;
      }
      if (control.errors?.['maxlength']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['maxlength'].requiredLength} characters.`;
      }
      if (control.errors?.['min']) {
        return `${this.getFieldLabel(fieldName)} must be at least ${control.errors['min'].min}.`;
      }
      if (control.errors?.['max']) {
        return `${this.getFieldLabel(fieldName)} must not exceed ${control.errors['max'].max}.`;
      }
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Title',
      description: 'Description',
      genre: 'Genre',
      releaseYear: 'Release Year',
      director: 'Director',
      rating: 'Rating'
    };
    return labels[fieldName] || fieldName;
  }
}
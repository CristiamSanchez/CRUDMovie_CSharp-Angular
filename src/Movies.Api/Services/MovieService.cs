using Microsoft.EntityFrameworkCore;
using Movies.Api.Data;
using Movies.Api.DTOs;
using Movies.Api.Models;
using Movies.Api.Services;

namespace Movies.Api.Services;

public class MovieService : IMovieService
{
    private readonly MoviesDbContext _context;

    public MovieService(MoviesDbContext context)
    {
        _context = context;
    }

    public async Task<List<MovieDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var movies = await _context.Movies
            .AsNoTracking()
            .OrderBy(m => m.Title)
            .ToListAsync(cancellationToken);

        return movies.Select(MapToDto).ToList();
    }

    public async Task<MovieDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var movie = await _context.Movies
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        return movie != null ? MapToDto(movie) : null;
    }

    public async Task<MovieDto> CreateAsync(CreateMovieDto dto, CancellationToken cancellationToken = default)
    {
        if (!Enum.TryParse<Genre>(dto.Genre, true, out var genre))
        {
            throw new ArgumentException($"Invalid genre: {dto.Genre}");
        }

        var movie = new Movie
        {
            Title = dto.Title,
            Description = dto.Description,
            Genre = genre,
            ReleaseYear = dto.ReleaseYear,
            Director = dto.Director,
            Rating = dto.Rating
        };

        _context.Movies.Add(movie);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(movie);
    }

    public async Task<MovieDto?> UpdateAsync(int id, UpdateMovieDto dto, CancellationToken cancellationToken = default)
    {
        var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (movie == null)
        {
            return null;
        }

        if (!Enum.TryParse<Genre>(dto.Genre, true, out var genre))
        {
            throw new ArgumentException($"Invalid genre: {dto.Genre}");
        }

        movie.Title = dto.Title;
        movie.Description = dto.Description;
        movie.Genre = genre;
        movie.ReleaseYear = dto.ReleaseYear;
        movie.Director = dto.Director;
        movie.Rating = dto.Rating;

        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(movie);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var movie = await _context.Movies.FirstOrDefaultAsync(m => m.Id == id, cancellationToken);

        if (movie == null)
        {
            return false;
        }

        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static MovieDto MapToDto(Movie movie)
    {
        return new MovieDto
        {
            Id = movie.Id,
            Title = movie.Title,
            Description = movie.Description,
            Genre = movie.Genre.ToString(),
            ReleaseYear = movie.ReleaseYear,
            Director = movie.Director,
            Rating = movie.Rating
        };
    }
}
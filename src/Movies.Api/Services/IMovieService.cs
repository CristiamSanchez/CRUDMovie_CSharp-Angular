using Movies.Api.DTOs;

namespace Movies.Api.Services;

public interface IMovieService
{
    Task<List<MovieDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<MovieDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<MovieDto> CreateAsync(CreateMovieDto dto, CancellationToken cancellationToken = default);
    Task<MovieDto?> UpdateAsync(int id, UpdateMovieDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
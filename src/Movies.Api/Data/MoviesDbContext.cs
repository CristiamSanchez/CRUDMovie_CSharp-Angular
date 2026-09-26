using Microsoft.EntityFrameworkCore;
using Movies.Api.Models;

namespace Movies.Api.Data;

public class MoviesDbContext : DbContext
{
    public MoviesDbContext(DbContextOptions<MoviesDbContext> options) : base(options)
    {
    }

    public DbSet<Movie> Movies => Set<Movie>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Movie>(entity =>
        {
            entity.Property(e => e.Genre)
                .HasConversion<string>();

            entity.Property(e => e.Rating)
                .HasPrecision(3, 1);

            // Seed some initial data
            entity.HasData(
                new Movie
                {
                    Id = 1,
                    Title = "The Shawshank Redemption",
                    Description = "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                    Genre = Genre.Drama,
                    ReleaseYear = 1994,
                    Director = "Frank Darabont",
                    Rating = 9.3m
                },
                new Movie
                {
                    Id = 2,
                    Title = "The Godfather",
                    Description = "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
                    Genre = Genre.Drama,
                    ReleaseYear = 1972,
                    Director = "Francis Ford Coppola",
                    Rating = 9.2m
                },
                new Movie
                {
                    Id = 3,
                    Title = "The Dark Knight",
                    Description = "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                    Genre = Genre.Action,
                    ReleaseYear = 2008,
                    Director = "Christopher Nolan",
                    Rating = 9.0m
                }
            );
        });
    }
}
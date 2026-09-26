using System.ComponentModel.DataAnnotations;

namespace Movies.Api.DTOs;

public class MovieDto
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public string Genre { get; set; } = string.Empty;

    [Required]
    [Range(1888, 2100)]
    public int ReleaseYear { get; set; }

    [Required]
    [MaxLength(100)]
    public string Director { get; set; } = string.Empty;

    [Required]
    [Range(0.0, 10.0)]
    public decimal Rating { get; set; }
}
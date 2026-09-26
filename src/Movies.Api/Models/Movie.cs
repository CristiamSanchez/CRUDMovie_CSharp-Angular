using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Movies.Api.Models;

public class Movie
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Genre Genre { get; set; }

    [Required]
    [Range(1888, 2100)]
    public int ReleaseYear { get; set; }

    [Required]
    [MaxLength(100)]
    public string Director { get; set; } = string.Empty;

    [Required]
    [Range(0.0, 10.0)]
    [Column(TypeName = "decimal(3,1)")]
    public decimal Rating { get; set; }
}
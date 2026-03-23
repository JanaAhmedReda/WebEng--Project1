using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class CreatePetDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Breed { get; set; }

    [Range(0, 30)] 
    public int Age { get; set; }

    [Required]
    public int ShelterId { get; set; }
}
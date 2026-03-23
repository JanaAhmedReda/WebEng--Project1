using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class UpdatePetDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Breed { get; set; }

    [Range(0, 30)]
    public int Age { get; set; }

    public int ShelterId { get; set; }

}
using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class ShelterNameDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
}
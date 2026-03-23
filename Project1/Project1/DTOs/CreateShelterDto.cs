using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class CreateShelterDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;

    [EmailAddress]
    public string? ContactEmail { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }
}
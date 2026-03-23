using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class ApplyDto
{
    [Required]
    public int PetId { get; set; }

    [Required]
    public string AdopterId { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? MotivationMessage { get; set; }

    [Required]
    public DateTime ApplicationDate { get; set; } = DateTime.UtcNow;
}
using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class UpdateAdoptionStatusDto
{
    [Required]
    public int PetId { get; set; }

    [Required]
    public string UserId { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;
}
using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class CreatePetDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public string? Breed { get; set; }

    [Range(0, 999)]
    public int Age { get; set; }

    [Required]
    [RegularExpression("^(Years|Months|Weeks)$", ErrorMessage = "Age unit must be Years, Months, or Weeks.")]
    public string AgeUnit { get; set; } = "Years";

    [MaxLength(500)]
    public string? HealthNotes { get; set; }

    public bool IsVaccinated { get; set; }

    [Required]
    public int ShelterId { get; set; }
}
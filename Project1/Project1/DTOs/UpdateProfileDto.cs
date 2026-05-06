using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project1.DTOs;

public class UpdateProfileDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    [JsonPropertyName("lastName")]
    public string LastName { get; set; } = string.Empty;
}
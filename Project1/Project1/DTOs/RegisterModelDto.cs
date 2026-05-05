using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project1.DTOs;

public class RegisterModelDto
{
    [Required]
    [EmailAddress]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(32, MinimumLength = 6)] // Replaces Range for strings
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

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

    [Phone]
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }

    [JsonPropertyName("role")]
    public string? Role { get; set; } // Requested role (User, Employee, or Admin)
}
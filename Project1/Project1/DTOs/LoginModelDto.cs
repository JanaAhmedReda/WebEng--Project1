using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project1.DTOs;

public class LoginModelDto
{
    [Required]
    [EmailAddress]
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}


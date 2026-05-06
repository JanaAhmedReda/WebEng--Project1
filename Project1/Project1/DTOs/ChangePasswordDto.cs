using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Project1.DTOs;

public class ChangePasswordDto
{
    [Required]
    [JsonPropertyName("currentPassword")]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required]
    [StringLength(32, MinimumLength = 6)]
    [JsonPropertyName("newPassword")]
    public string NewPassword { get; set; } = string.Empty;

    [Required]
    [Compare(nameof(NewPassword), ErrorMessage = "New password and confirmation do not match")]
    [JsonPropertyName("confirmNewPassword")]
    public string ConfirmNewPassword { get; set; } = string.Empty;
}
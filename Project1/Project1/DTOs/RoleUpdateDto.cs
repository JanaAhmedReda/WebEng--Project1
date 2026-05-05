using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class RoleUpdateDto
{
    [Required]
    public string Role { get; set; } = string.Empty;
}

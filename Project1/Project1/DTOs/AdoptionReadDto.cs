using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class AdoptionReadDto
{
    public string UserId { get; set; } = string.Empty;
    public int PetId { get; set; }
    public string PetName { get; set; } = string.Empty;
    public string AdopterName { get; set; } = string.Empty;
    public DateTime ApplicationDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? MotivationMessage { get; set; }
}
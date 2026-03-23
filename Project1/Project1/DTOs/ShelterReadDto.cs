using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;
public class ShelterReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
}
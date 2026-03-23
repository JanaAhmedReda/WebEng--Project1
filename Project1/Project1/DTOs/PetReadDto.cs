using System.ComponentModel.DataAnnotations;

namespace Project1.DTOs;

public class PetReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Breed { get; set; }
    public int Age { get; set; }
    public string ShelterName { get; set; } = string.Empty;
}


using System.ComponentModel.DataAnnotations; 
using System.ComponentModel.DataAnnotations.Schema;

namespace Project1.Models;

public class Shelter
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Address { get; set; }

    public List<Pet> Pets { get; set; } = new List<Pet>();
}
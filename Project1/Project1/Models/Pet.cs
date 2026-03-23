using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project1.Models;

public class Pet
{
    public int Id { get; set; }
    
    [StringLength(100)]
    public required string Name { get; set; }
    public string? Breed { get; set; }
    public int Age { get; set; }

    [ForeignKey("Shelter")]
    public int ShelterId { get; set; }
    
    public Shelter? Shelter { get; set; }

    
    public PetProfile? PetProfile { get; set; }

        public List<AdoptionApplication> Applications { get; set; } = new List<AdoptionApplication>();
}
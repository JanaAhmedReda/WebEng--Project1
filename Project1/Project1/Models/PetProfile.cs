namespace Project1.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class PetProfile
{
    [Key]
    [ForeignKey("Pet")]
    public int PetId { get; set; }
    
    public string? HealthNotes { get; set; }
    public bool IsVaccinated { get; set; }

    public required Pet Pet { get; set; }
}
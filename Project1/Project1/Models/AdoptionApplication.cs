namespace Project1.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

public class AdoptionApplication
{
    [ForeignKey("Pet")]
    public int PetId { get; set; }
    public Pet? Pet { get; set; }

    [ForeignKey("User")]
    public required string UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public DateTime ApplicationDate { get; set; }
    public string Status { get; set; } = "Pending";
}
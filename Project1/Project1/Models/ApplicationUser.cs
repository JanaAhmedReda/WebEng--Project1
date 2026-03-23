using Microsoft.AspNetCore.Identity;

namespace Project1.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public List<AdoptionApplication> Applications { get; set; } = new List<AdoptionApplication>();
    }
}
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Project1.Models;

namespace Project1.Database;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser> {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Pet> Pets { get; set; }
    public DbSet<Shelter> Shelters { get; set; }
    public DbSet<PetProfile> PetProfiles { get; set; }
    public DbSet<AdoptionApplication> AdoptionApplications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AdoptionApplication>()
            .HasKey(aa => new { aa.PetId, aa.UserId });

        modelBuilder.Entity<Pet>()
            .HasOne(p => p.PetProfile)
            .WithOne(pp => pp.Pet)
            .HasForeignKey<PetProfile>(pp => pp.PetId);
    }
}
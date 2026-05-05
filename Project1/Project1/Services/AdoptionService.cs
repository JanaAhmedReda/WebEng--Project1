using Microsoft.EntityFrameworkCore;
using Project1.Database;
using Project1.Interfaces;
using Project1.DTOs;
using Project1.Models;

namespace Project1.Services;

public class AdoptionService : IAdoptionService
{
    private readonly ApplicationDbContext _context;

    public AdoptionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AdoptionReadDto> ApplyForAdoptionAsync(ApplyDto applyDto)
    {
        var application = new AdoptionApplication
        {
            PetId = applyDto.PetId,
            UserId = applyDto.AdopterId,
            ApplicationDate = applyDto.ApplicationDate,
            Status = "Pending"
        };

        _context.AdoptionApplications.Add(application);
        await _context.SaveChangesAsync();

        // Load with includes
        var savedApplication = await _context.AdoptionApplications
            .Include(a => a.Pet)
            .Include(a => a.User)
            .FirstAsync(a => a.PetId == application.PetId && a.UserId == application.UserId);

        return new AdoptionReadDto
        {
            UserId = savedApplication.UserId,
            PetId = savedApplication.PetId,
            PetName = savedApplication.Pet!.Name,
            AdopterName = savedApplication.User!.FirstName + " " + savedApplication.User.LastName,
            ApplicationDate = savedApplication.ApplicationDate,
            Status = savedApplication.Status
        };
    }

    public async Task<IEnumerable<AdoptionReadDto>> GetAllApplicationsAsync()
    {
        return await _context.AdoptionApplications
            .Include(a => a.Pet)
            .Include(a => a.User)
            .AsNoTracking()
            .Select(a => new AdoptionReadDto
            {
                UserId = a.UserId,
                PetId = a.PetId,
                PetName = a.Pet != null ? a.Pet.Name : "Unknown",
                AdopterName = (a.User != null ? a.User.FirstName : "Unknown") + " " + (a.User != null ? a.User.LastName : "Unknown"),
                ApplicationDate = a.ApplicationDate,
                Status = a.Status
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<AdoptionReadDto>> GetApplicationsByPetIdAsync(int petId)
    {
        return await _context.AdoptionApplications
            .Include(a => a.Pet)
            .Include(a => a.User)
            .Where(a => a.PetId == petId)
            .AsNoTracking()
            .Select(a => new AdoptionReadDto
            {
                UserId = a.UserId,
                PetId = a.PetId,
                PetName = a.Pet != null ? a.Pet.Name : "Unknown",
                AdopterName = (a.User != null ? a.User.FirstName : "Unknown") + " " + (a.User != null ? a.User.LastName : "Unknown"),
                ApplicationDate = a.ApplicationDate,
                Status = a.Status
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<AdoptionReadDto>> GetUserApplicationsAsync(string userId)
    {
        return await _context.AdoptionApplications
            .Include(a => a.Pet)
            .Include(a => a.User)
            .Where(a => a.UserId == userId)
            .AsNoTracking()
            .Select(a => new AdoptionReadDto
            {
                UserId = a.UserId,
                PetId = a.PetId,
                PetName = a.Pet != null ? a.Pet.Name : "Unknown",
                AdopterName = (a.User != null ? a.User.FirstName : "Unknown") + " " + (a.User != null ? a.User.LastName : "Unknown"),
                ApplicationDate = a.ApplicationDate,
                Status = a.Status
            })
            .ToListAsync();
    }

    public async Task<bool> UpdateApplicationStatusAsync(int petId, string userId, string status)
    {
        var application = await _context.AdoptionApplications
            .FirstOrDefaultAsync(a => a.PetId == petId && a.UserId == userId);

        if (application == null) return false;

        application.Status = status;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteApplicationAsync(int petId, string userId)
    {
        var application = await _context.AdoptionApplications
            .FirstOrDefaultAsync(a => a.PetId == petId && a.UserId == userId);

        if (application == null) return false;

        _context.AdoptionApplications.Remove(application);
        await _context.SaveChangesAsync();
        return true;
    }
}
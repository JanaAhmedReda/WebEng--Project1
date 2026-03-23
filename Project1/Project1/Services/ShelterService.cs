namespace Project1.Services;
using Project1.DTOs;
using Project1.Database;
using Microsoft.EntityFrameworkCore;
using Project1.Models;
using Project1.Interfaces;


public class ShelterService : IShelterService
{
    private readonly ApplicationDbContext _context;

    public ShelterService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ShelterReadDto>> GetAllSheltersAsync()
    {
        return await _context.Shelters
            .AsNoTracking()
            .Select(s => new ShelterReadDto 
            { 
                Id = s.Id, 
                Name = s.Name, 
                Address = s.Address 
            }).ToListAsync();
    }

    public async Task<ShelterReadDto> AddShelterAsync(CreateShelterDto dto)
    {
        var shelter = new Shelter { Name = dto.Name, Address = dto.Address };
        _context.Shelters.Add(shelter);
        await _context.SaveChangesAsync();
        return new ShelterReadDto { Id = shelter.Id, Name = shelter.Name };
    }

    public async Task<ShelterReadDto?> GetShelterByIdAsync(int id)
    {
        return await _context.Shelters
            .AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new ShelterReadDto 
            { 
                Id = s.Id, 
                Name = s.Name, 
                Address = s.Address 
            }).FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteShelterAsync(int id)
    {
        var shelter = await _context.Shelters.FindAsync(id);
        if (shelter == null) return false;
        _context.Shelters.Remove(shelter);
        await _context.SaveChangesAsync();
        return true;
    }
}
using Microsoft.EntityFrameworkCore;
using Project1.Database;
using Project1.Interfaces;
using Project1.DTOs;
using Project1.Models;

namespace Project1.Services;

public class PetService : IPetService {
    private readonly ApplicationDbContext _context;
    public PetService(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<PetReadDto>> GetAllPetsAsync() {
        return await _context.Pets
            .Include(p => p.Shelter)
            .AsNoTracking() 
            .Select(p => new PetReadDto { 
                Id = p.Id,
                Name = p.Name,
                Breed = p.Breed,
                Age = p.Age,
                ShelterName = p.Shelter!.Name
            }).ToListAsync();
    }

    public async Task<PetDetailsDto?> GetPetByIdAsync(int id) {
        return await _context.Pets
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PetDetailsDto {
                Id = p.Id,
                Name = p.Name,
                HealthNotes = p.PetProfile != null ? (p.PetProfile.HealthNotes ?? "N/A") : "N/A"
            }).FirstOrDefaultAsync();
    }

    public async Task<PetReadDto> AddPetAsync(CreatePetDto petDto) {
        var pet = new Pet {
            Name = petDto.Name,
            Breed = petDto.Breed,
            Age = petDto.Age,
            ShelterId = petDto.ShelterId
        };
        _context.Pets.Add(pet);
        await _context.SaveChangesAsync();
        
        var shelterName = await _context.Shelters
            .Where(s => s.Id == petDto.ShelterId)
            .Select(s => s.Name)
            .FirstOrDefaultAsync();
        return new PetReadDto {
            Id = pet.Id,
            Name = pet.Name,
            Breed = pet.Breed,
            Age = pet.Age,
            ShelterName = shelterName ?? "Unknown"
        };
    }

    public async Task<PetReadDto?> UpdatePetAsync(int id, UpdatePetDto petDto) {
        var pet = await _context.Pets.FindAsync(id);
        if (pet == null) return null;
        pet.Name = petDto.Name;
        pet.Breed = petDto.Breed;
        pet.Age = petDto.Age;
        pet.ShelterId = petDto.ShelterId;
        await _context.SaveChangesAsync();
        
        var shelterName = await _context.Shelters
            .Where(s => s.Id == petDto.ShelterId)
            .Select(s => s.Name)
            .FirstOrDefaultAsync();
        return new PetReadDto {
            Id = pet.Id,
            Name = pet.Name,
            Breed = pet.Breed,
            Age = pet.Age,
            ShelterName = shelterName ?? "Unknown"
        };
    }

    public async Task<bool> DeletePetAsync(int id) {
        var pet = await _context.Pets.FindAsync(id);
        if (pet == null) return false;
        _context.Pets.Remove(pet);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<PetReadDto>> GetPetsByShelterIdAsync(int shelterId) {
        return await _context.Pets
            .Include(p => p.Shelter)
            .AsNoTracking()
            .Where(p => p.ShelterId == shelterId)
            .Select(p => new PetReadDto {
                Id = p.Id,
                Name = p.Name,
                Breed = p.Breed,
                Age = p.Age,
                ShelterName = p.Shelter!.Name
            }).ToListAsync();
    }

    public async Task<ShelterNameDto> GetShelterNameAsync(int petId) {
        var pet = await _context.Pets
            .Include(p => p.Shelter)
            .AsNoTracking()
            .Where(p => p.Id == petId)
            .Select(p => new ShelterNameDto { Name = p.Shelter!.Name })
            .FirstOrDefaultAsync();
        return pet ?? new ShelterNameDto { Name = "Unknown" };
    }
}
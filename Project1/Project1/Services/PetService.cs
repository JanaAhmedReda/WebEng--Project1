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
                AgeUnit = p.AgeUnit,
                ShelterName = p.Shelter!.Name
            }).ToListAsync();
    }

    public async Task<PetDetailsDto?> GetPetByIdAsync(int id) {
        return await _context.Pets
            .Include(p => p.Shelter)
            .Include(p => p.PetProfile)
            .AsNoTracking()
            .Where(p => p.Id == id)
            .Select(p => new PetDetailsDto {
                Id = p.Id,
                Name = p.Name,
                Breed = p.Breed,
                Age = p.Age,
                AgeUnit = p.AgeUnit,
                ShelterName = p.Shelter != null ? p.Shelter.Name : "Unknown",
                HealthNotes = p.PetProfile != null ? (string.IsNullOrWhiteSpace(p.PetProfile.HealthNotes) ? "No health notes provided" : p.PetProfile.HealthNotes) : "No health notes provided",
                IsVaccinated = p.PetProfile != null && p.PetProfile.IsVaccinated
            }).FirstOrDefaultAsync();
    }

    public async Task<PetReadDto> AddPetAsync(CreatePetDto petDto) {
        var pet = new Pet {
            Name = petDto.Name,
            Breed = petDto.Breed,
            Age = petDto.Age,
            AgeUnit = petDto.AgeUnit,
            ShelterId = petDto.ShelterId
        };
        _context.Pets.Add(pet);
        await _context.SaveChangesAsync();

        _context.PetProfiles.Add(new PetProfile {
            PetId = pet.Id,
            HealthNotes = string.IsNullOrWhiteSpace(petDto.HealthNotes) ? "No health notes provided" : petDto.HealthNotes,
            IsVaccinated = petDto.IsVaccinated,
            Pet = pet
        });
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
            AgeUnit = pet.AgeUnit,
            ShelterName = shelterName ?? "Unknown"
        };
    }

    public async Task<PetReadDto?> UpdatePetAsync(int id, UpdatePetDto petDto) {
        var pet = await _context.Pets
            .Include(p => p.PetProfile)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (pet == null) return null;
        pet.Name = petDto.Name;
        pet.Breed = petDto.Breed;
        pet.Age = petDto.Age;
        pet.AgeUnit = petDto.AgeUnit;
        pet.ShelterId = petDto.ShelterId;

        if (pet.PetProfile == null)
        {
            pet.PetProfile = new PetProfile
            {
                PetId = pet.Id,
                Pet = pet
            };
        }

        pet.PetProfile.HealthNotes = string.IsNullOrWhiteSpace(petDto.HealthNotes)
            ? "No health notes provided"
            : petDto.HealthNotes;
        pet.PetProfile.IsVaccinated = petDto.IsVaccinated;
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
            AgeUnit = pet.AgeUnit,
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
                AgeUnit = p.AgeUnit,
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
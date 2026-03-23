using Project1.DTOs;
using Project1.Models;

namespace Project1.Interfaces;

public interface IPetService
{
    
    Task<IEnumerable<PetReadDto>> GetAllPetsAsync();
    Task<PetDetailsDto?> GetPetByIdAsync(int id);
    
    
    Task<PetReadDto> AddPetAsync(CreatePetDto petDto);
    Task<PetReadDto?> UpdatePetAsync(int id, UpdatePetDto petDto);
    
    Task<bool> DeletePetAsync(int id);

    
    Task<IEnumerable<PetReadDto>> GetPetsByShelterIdAsync(int shelterId);
    Task<ShelterNameDto> GetShelterNameAsync(int petId);
}
using Project1.DTOs;
using Project1.Models;

namespace Project1.Interfaces;

public interface IAdoptionService
{
    
    Task<AdoptionReadDto> ApplyForAdoptionAsync(ApplyDto applyDto);
    
    Task<IEnumerable<AdoptionReadDto>> GetAllApplicationsAsync();
    
    Task<IEnumerable<AdoptionReadDto>> GetApplicationsByPetIdAsync(int petId);
    
    
    Task<IEnumerable<AdoptionReadDto>> GetUserApplicationsAsync(string userId);
    
    
    Task<bool> UpdateApplicationStatusAsync(int petId, string userId, string status);
    
    Task<bool> DeleteApplicationAsync(int petId, string userId);
}
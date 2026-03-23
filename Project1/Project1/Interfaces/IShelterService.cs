using Project1.DTOs;
using Project1.Models;

namespace Project1.Interfaces;

public interface IShelterService
{
    Task<IEnumerable<ShelterReadDto>> GetAllSheltersAsync();
    Task<ShelterReadDto?> GetShelterByIdAsync(int id);
    Task<ShelterReadDto> AddShelterAsync(CreateShelterDto shelterDto);
    Task<bool> DeleteShelterAsync(int id);
}
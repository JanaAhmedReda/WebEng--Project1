using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.DTOs;
using Project1.Interfaces;
using Project1.Models;

namespace Project1.Controllers;

[Route("api/pets")]
[ApiController]
[Authorize]
public class PetController : ControllerBase
{
    private readonly IPetService _petService;

    public PetController(IPetService petService)
    {
        _petService = petService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPets()
    {
        
        var pets = await _petService.GetAllPetsAsync();
        return Ok(pets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPetById(int id)
    {
        var pet = await _petService.GetPetByIdAsync(id);
        if (pet == null) return NotFound();
        return Ok(pet);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Staff")] 
    public async Task<IActionResult> AddPet([FromBody] CreatePetDto petDto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var addedPet = await _petService.AddPetAsync(petDto);
        return CreatedAtAction(nameof(GetPetById), new { id = addedPet.Id }, addedPet);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Staff")]
    public async Task<IActionResult> UpdatePet(int id, [FromBody] UpdatePetDto petDto)
    {
        var updated = await _petService.UpdatePetAsync(id, petDto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePet(int id)
    {
        var result = await _petService.DeletePetAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
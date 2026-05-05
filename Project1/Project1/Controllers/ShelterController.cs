namespace Project1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.Interfaces;
using Project1.DTOs;


[Route("api/shelters")]
[ApiController]
[Authorize]
public class ShelterController : ControllerBase
{
    private readonly IShelterService _shelterService;
    private readonly IPetService _petService;

    public ShelterController(IShelterService shelterService, IPetService petService)
    {
        _shelterService = shelterService;
        _petService = petService;
    }

    [HttpGet]
    [AllowAnonymous] // Anyone can view shelters
    public async Task<IActionResult> GetShelters()
    {
        var shelters = await _shelterService.GetAllSheltersAsync();
        return Ok(shelters);
    }

    [HttpGet("{id}/pets")]
    [AllowAnonymous] // Anyone can view pets by shelter
    public async Task<IActionResult> GetPetsByShelter(int id)
    {
        var pets = await _petService.GetPetsByShelterIdAsync(id);
        return Ok(pets);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> CreateShelter([FromBody] CreateShelterDto dto)
    {
        var shelter = await _shelterService.AddShelterAsync(dto);
        return CreatedAtAction(nameof(GetShelters), new { id = shelter.Id }, shelter);
    }

    [HttpGet("{id}")]
    [AllowAnonymous] // Anyone can view shelter by ID
    public async Task<IActionResult> GetShelterById(int id)
    {
        var shelter = await _shelterService.GetShelterByIdAsync(id);
        if (shelter == null) return NotFound();
        return Ok(shelter);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> UpdateShelter(int id, [FromBody] CreateShelterDto dto)
    {
        var shelter = await _shelterService.UpdateShelterAsync(id, dto);
        if (shelter == null) return NotFound();
        return Ok(shelter);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteShelter(int id)
    {
        var success = await _shelterService.DeleteShelterAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
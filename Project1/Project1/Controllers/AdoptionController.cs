using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.DTOs;
using Project1.Interfaces;

namespace Project1.Controllers;

[Route("api/adoptions")]
[ApiController]
[Authorize]
public class AdoptionController : ControllerBase
{
    private readonly IAdoptionService _adoptionService;

    public AdoptionController(IAdoptionService adoptionService)
    {
        _adoptionService = adoptionService;
    }

    [HttpPost("apply")]
    public async Task<IActionResult> ApplyForAdoption([FromBody] ApplyDto dto)
    {
        var result = await _adoptionService.ApplyForAdoptionAsync(dto);
        return Ok(result);
    }

    [HttpGet("pet/{petId}")]
    public async Task<IActionResult> GetApplicationsByPet(int petId)
    {
        var applications = await _adoptionService.GetApplicationsByPetIdAsync(petId);
        return Ok(applications);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserApplications(string userId)
    {
        var applications = await _adoptionService.GetUserApplicationsAsync(userId);
        return Ok(applications);
    }

    [HttpPut("status")]
    public async Task<IActionResult> UpdateApplicationStatus([FromBody] UpdateAdoptionStatusDto dto)
    {
        var success = await _adoptionService.UpdateApplicationStatusAsync(dto.PetId, dto.UserId, dto.Status);
        if (!success) return NotFound();
        return Ok();
    }
}
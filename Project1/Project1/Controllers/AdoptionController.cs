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

    [HttpGet("all")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetAllApplications()
    {
        var applications = await _adoptionService.GetAllApplicationsAsync();
        return Ok(applications);
    }

    [HttpPost("apply")]
    [Authorize(Roles = "Admin,Employee,User")]
    public async Task<IActionResult> ApplyForAdoption([FromBody] ApplyDto dto)
    {
        var result = await _adoptionService.ApplyForAdoptionAsync(dto);
        return Ok(result);
    }

    [HttpGet("pet/{petId}")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetApplicationsByPet(int petId)
    {
        var applications = await _adoptionService.GetApplicationsByPetIdAsync(petId);
        return Ok(applications);
    }

    [HttpGet("user/{userId}")]
    [Authorize(Roles = "Admin,Employee,User")]
    public async Task<IActionResult> GetUserApplications(string userId)
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var isElevated = User.IsInRole("Admin") || User.IsInRole("Employee");
        if (!isElevated && !string.Equals(currentUserId, userId, StringComparison.OrdinalIgnoreCase))
        {
            return Forbid();
        }

        var applications = await _adoptionService.GetUserApplicationsAsync(userId);
        return Ok(applications);
    }

    [HttpPut("status")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> UpdateApplicationStatus([FromBody] UpdateAdoptionStatusDto dto)
    {
        var success = await _adoptionService.UpdateApplicationStatusAsync(dto.PetId, dto.UserId, dto.Status);
        if (!success) return NotFound();
        return Ok();
    }

    [HttpDelete("{petId}/{userId}")]
    [Authorize(Roles = "Admin,Employee,User")]
    public async Task<IActionResult> DeleteApplication(int petId, string userId)
    {
        var success = await _adoptionService.DeleteApplicationAsync(petId, userId);
        if (!success) return NotFound();
        return NoContent();
    }
}
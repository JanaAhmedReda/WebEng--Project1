namespace Project1.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project1.Interfaces;


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
    public async Task<IActionResult> GetShelters()
    {
        var shelters = await _shelterService.GetAllSheltersAsync();
        return Ok(shelters);
    }

    [HttpGet("{id}/pets")]
    public async Task<IActionResult> GetPetsByShelter(int id)
    {
        var pets = await _petService.GetPetsByShelterIdAsync(id);
        return Ok(pets);
    }
}
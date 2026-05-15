
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Project1.Models;
using Project1.DTOs;




namespace Project1.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    // ADMIN: List all users
    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = _userManager.Users.ToList();
        var userList = new List<object>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Roles = roles
            });
        }
        return Ok(userList);
    }

    // ADMIN: Update user role
    [HttpPut("users/{userId}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] RoleUpdateDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        var currentRoles = await _userManager.GetRolesAsync(user);
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { message = "Failed to remove old roles" });

        // Ensure role exists
        if (!await _roleManager.RoleExistsAsync(dto.Role))
            await _roleManager.CreateAsync(new IdentityRole(dto.Role));

        var addResult = await _userManager.AddToRoleAsync(user, dto.Role);
        if (!addResult.Succeeded)
            return BadRequest(new { message = "Failed to add new role" });

        return Ok(new { message = "Role updated" });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModelDto model)
    {
        // Validate model binding
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { message = string.Join("; ", errors) });
        }

        // Validate required fields
        if (string.IsNullOrWhiteSpace(model.FirstName) || string.IsNullOrWhiteSpace(model.LastName) || 
            string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            return BadRequest(new { message = "All required fields must be filled" });
        }

        try
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber,
                RequestedRole = model.Role // Store the requested role (e.g., "Employee", "Admin")
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                // Ensure the "User" role exists
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("User"));
                }

                await _userManager.AddToRoleAsync(user, "User");
                
                var token = GenerateJwtToken(user, new List<string> { "User" });
                SetTokenCookie(token);
                Response.Headers["Authorization"] = $"Bearer {token}";
                return Ok(new {
                    Message = "User registered successfully",
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = new List<string> { "User" }
                });
            }
            
            // Return errors in a format the frontend can understand
            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = string.Join("; ", errorMessages) });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Registration failed: {ex.Message}" });
        }
    }

    [HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginModelDto model) {
    var user = await _userManager.FindByEmailAsync(model.Email);
    if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password)) {
        return BadRequest(new { Message = "Invalid credentials" });
    }

    var roles = await _userManager.GetRolesAsync(user);
    var token = GenerateJwtToken(user, roles);

    
    SetTokenCookie(token);
    Response.Headers["Authorization"] = $"Bearer {token}";

    return Ok(new {
        Message = "Login successful",
        Id = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        PhoneNumber = user.PhoneNumber,
        Roles = roles
    });
}

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "User not found in claims" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { Message = "User not found" });
        }

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Roles = roles
        });
    }

    [HttpPost("logout")]
    [Authorize]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("jwt");
        return Ok(new { Message = "Logout successful" });
    }

    [HttpDelete("me")]
    [Authorize]
    public async Task<IActionResult> DeleteCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "User not found in claims" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
        {
            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = string.Join("; ", errorMessages) });
        }

        Response.Cookies.Delete("jwt");
        return Ok(new { Message = "Account deleted successfully" });
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateCurrentUser([FromBody] UpdateProfileDto model)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { message = string.Join("; ", errors) });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "User not found in claims" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }

        user.FirstName = model.FirstName.Trim();
        user.LastName = model.LastName.Trim();

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = string.Join("; ", errorMessages) });
        }

        var roles = await _userManager.GetRolesAsync(user);
        return Ok(new
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            Roles = roles
        });
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
            return BadRequest(new { message = string.Join("; ", errors) });
        }

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Message = "User not found in claims" });
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound(new { Message = "User not found" });
        }

        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
        if (!result.Succeeded)
        {
            var errorMessages = result.Errors.Select(e => e.Description).ToList();
            return BadRequest(new { message = string.Join("; ", errorMessages) });
        }

        return Ok(new { Message = "Password updated successfully" });
    }

    private string GenerateJwtToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("FirstName", user.FirstName),
            new Claim("LastName", user.LastName)
        };

        
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private void SetTokenCookie(string token)
    {
        Response.Cookies.Append("jwt", token, new CookieOptions
        {
            HttpOnly = true,
            // Set Secure only when the request is HTTPS (allow HTTP during local development)
            Secure = Request.IsHttps,
            // Use Lax to allow the cookie to be sent in common cross-site scenarios while being safer than None
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddHours(1)
        });
    }

    // ADMIN/EMPLOYEE: Get pending role requests (users who requested Employee/Admin role)
    [HttpGet("role-requests")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> GetPendingRoleRequests()
    {
        var users = _userManager.Users
            .Where(u => !string.IsNullOrEmpty(u.RequestedRole)&& u.RequestedRole != "User")
        .ToList();

        var requests = new List<object>();
        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            requests.Add(new
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                CurrentRole = roles.FirstOrDefault() ?? "User",
                RequestedRole = user.RequestedRole
            });
        }

        return Ok(requests);
    }

    // ADMIN/EMPLOYEE: Approve a role request (change user's role to requested role)
    [HttpPost("role-requests/{userId}/approve")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> ApproveRoleRequest(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (string.IsNullOrEmpty(user.RequestedRole))
            return BadRequest(new { message = "User has no pending role request" });

        var requestedRole = user.RequestedRole; // capture before clearing
        var currentRoles = await _userManager.GetRolesAsync(user);
        var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
        if (!removeResult.Succeeded)
            return BadRequest(new { message = "Failed to remove old roles" });

        // Ensure requested role exists
        if (!await _roleManager.RoleExistsAsync(requestedRole))
            await _roleManager.CreateAsync(new IdentityRole(requestedRole));

        var addResult = await _userManager.AddToRoleAsync(user, requestedRole);
        if (!addResult.Succeeded)
            return BadRequest(new { message = "Failed to add requested role" });

        // Clear the request
        user.RequestedRole = null;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = $"Approved request. User promoted to {requestedRole}" });
    }

    // ADMIN: Deny a role request (clear the requested role, keep user as User)
    [HttpPost("role-requests/{userId}/deny")]
    [Authorize(Roles = "Admin,Employee")]
    public async Task<IActionResult> DenyRoleRequest(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (string.IsNullOrEmpty(user.RequestedRole))
            return BadRequest(new { message = "User has no pending role request" });

        var requestedRole = user.RequestedRole;
        user.RequestedRole = null;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = $"Denied request for {requestedRole}. User remains as User" });
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ClickNEatReact.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ClickNEatReact.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;

        public AuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("register/user")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel user)
        {
            var userExists = await userManager.FindByNameAsync(user.Username);
            if (userExists != null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { status="Error", title="User already exists" });
            }
            else
            {
                ApplicationUser appUser = new ApplicationUser()
                {
                    Email = user.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = user.Username,
                    PhoneNumber = user.Phone,
                    FirstName = user.Firstname,
                    LastName = user.Lastname
                };

                var result = await userManager.CreateAsync(appUser, user.Password);

                if (!result.Succeeded)
                {
                    var errorString = "";
                    foreach(var err in result.Errors)
                    {
                        errorString += err.Description + "\r\n";
                       
                    }
                    return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = errorString });
                }
                else
                {
                    if (!await roleManager.RoleExistsAsync(UserRole.User))
                    {
                        await roleManager.CreateAsync(new IdentityRole(UserRole.User));
                    }
                    if (await roleManager.RoleExistsAsync(UserRole.User))
                    {
                        await userManager.AddToRoleAsync(appUser, UserRole.User);
                    }
                    return StatusCode(StatusCodes.Status201Created, new Response { status = "Success", title = "User Created Successfully" });
                }
            }  
        }

        [Authorize(Roles =UserRole.Admin)]
        [HttpPost]
        [Route("register/waiter")]
        public async Task<IActionResult> RegisterWaiter([FromBody] RegistrationModel user)
        {
            var userExists = await userManager.FindByNameAsync(user.Username);
            if (userExists != null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = "User already exists" });
            }
            else
            {
                ApplicationUser appUser = new ApplicationUser()
                {
                    Email = user.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = user.Username,
                    PhoneNumber = user.Phone,
                    FirstName = user.Firstname,
                    LastName = user.Lastname
                };

                var result = await userManager.CreateAsync(appUser, user.Password);

                if (!result.Succeeded)
                {
                    var errorString = "";
                    foreach (var err in result.Errors)
                    {
                        errorString += err.Description + "\r\n";

                    }
                    return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = errorString });
                }
                else
                {
                    if (!await roleManager.RoleExistsAsync(UserRole.Waiter))
                    {
                        await roleManager.CreateAsync(new IdentityRole(UserRole.Waiter));
                    }
                    if (await roleManager.RoleExistsAsync(UserRole.Waiter))
                    {
                        await userManager.AddToRoleAsync(appUser, UserRole.Waiter);
                    }
                    return StatusCode(StatusCodes.Status201Created, new Response { status = "Success", title = "Waiter Created Successfully" });
                }
            }
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            var userExists = await userManager.FindByNameAsync(user.Username);
            if (userExists != null)
            {
                if (await userManager.CheckPasswordAsync(userExists, user.Password))
                {
                    var userRoles = await userManager.GetRolesAsync(userExists);
                    var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name,userExists.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                    };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    }

                    var authSignInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secrete"]));
                    var token = new JwtSecurityToken(
                        issuer: _configuration["JWT:ValidIssuer"],
                        audience: _configuration["JWT:ValidAudience"],
                        expires: DateTime.Now.AddHours(24),
                        claims: authClaims,
                        signingCredentials: new SigningCredentials(authSignInKey, SecurityAlgorithms.HmacSha256)
                        );
                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        
                        username=userExists.UserName,
                        userId=userExists.Id,
                        type=userRoles.Count>1?UserRole.Admin:userRoles[0],
                        token = new JwtSecurityTokenHandler().WriteToken(token)
                    });;
                }
                else
                    return Unauthorized();
            }
            else
            {
                return Unauthorized();
            }            
        }

        [HttpPost]
        [Route("register/admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegistrationModel user)
        {
            var userExists = await userManager.FindByNameAsync(user.Username);
            if (userExists != null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = "User already exists" });
            }
            else
            {
                ApplicationUser appUser = new ApplicationUser()
                {
                    Email = user.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    UserName = user.Username,
                    PhoneNumber = user.Phone,
                    FirstName = user.Firstname,
                    LastName = user.Lastname
                };

                var result = await userManager.CreateAsync(appUser, user.Password);

                if (!result.Succeeded)
                {
                    var errorString = "";
                    foreach (var err in result.Errors)
                    {
                        errorString += err.Description + "\r\n";

                    }
                    return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = errorString });
                }
                else
                {
                    if (!await roleManager.RoleExistsAsync(UserRole.Admin))
                    {
                        await roleManager.CreateAsync(new IdentityRole(UserRole.Admin));
                    }
                    if (!await roleManager.RoleExistsAsync(UserRole.Waiter))
                    {
                        await roleManager.CreateAsync(new IdentityRole(UserRole.Waiter));
                    }

                    if (!await roleManager.RoleExistsAsync(UserRole.User))
                    {
                        await roleManager.CreateAsync(new IdentityRole(UserRole.User));
                    }
                    if (await roleManager.RoleExistsAsync(UserRole.Admin))
                    {
                        await userManager.AddToRolesAsync(appUser,new List<string>() { UserRole.Admin, UserRole.User, UserRole.Waiter });
                    }
                    return StatusCode(StatusCodes.Status201Created, new Response { status = "Success", title = "Admin Created Successfully" });
                }
            }
        }

        [Authorize(Roles = UserRole.Admin)]
        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userManager.FindByNameAsync("admin");
            return Ok(new { user = users });
        }

        [Authorize(Roles = UserRole.Admin)]
        [HttpGet]
        [Route("users/waiters")]
        public async Task<IActionResult> GetWaiters()
        {
            var users = await userManager.GetUsersInRoleAsync(UserRole.Waiter);
            return Ok(new { user = users });
        }

        [Authorize(Roles = UserRole.Admin)]
        [HttpDelete]
        [Route("user/{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var userExists = await userManager.FindByNameAsync(username);
            if (userExists != null)
            {
                var users = await userManager.DeleteAsync(userExists);
            }
            else
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = "User doesn't exists" });
            }

            return NoContent();
        }

        [Authorize(Roles = UserRole.Admin)]
        [HttpGet]
        [Route("users/customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var users  = await userManager.GetUsersInRoleAsync(UserRole.User);
            var admins = await userManager.GetUsersInRoleAsync(UserRole.Admin);
            foreach(ApplicationUser admin in admins)
            {
                    users = users.Where<ApplicationUser>(U=>U.UserName != admin.UserName).ToList<ApplicationUser>();
            }
            //Console.WriteLine(JsonConvert.SerializeObject(users));
            return Ok(new { user = users });
        }

        [Authorize]
        [HttpPost]
        [Route("changePassword/{username}")]
        public async Task<IActionResult> ChangePassword([FromBody] PasswordData passwords, string username)
        {
            var user = await userManager.FindByNameAsync(username);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = "User does not exist" });
            }
            else
            {

                if (passwords.NewPassword.Equals(passwords.ConfirmPassword))
                {
                    var result = await userManager.ChangePasswordAsync(user, passwords.OldPassword, passwords.NewPassword);
                    if (!result.Succeeded)
                    {
                        var errorString = "";
                        foreach (var err in result.Errors)
                        {
                            errorString += err.Description + "\r\n";

                        }
                        return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = errorString });
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status200OK, new Response { status = "Success", title = "Password changed successfully" });
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new Response { status = "Error", title = "Confirm password doesn't match with new password"});
                }
            }
        }
    }
}

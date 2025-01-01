using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly HttpClient _httpClient;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
            _tokenService = tokenService;
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("https://graph.facebook.com")
            };
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized("User with the given email doesn't exist!");

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {

                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized("Invalid Password!");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "UserName is already taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is already taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {

                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            await SetRefreshToken(user);
            return BadRequest("Failed to register user");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            await SetRefreshToken(user);
            return CreateUserObject(user);
        }

        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                        .Include(r => r.RefreshTokens)
                        .Include(p => p.Photos)
                        .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive)
            {
                return Unauthorized();
            }

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUserObject(user);
        }

        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        [AllowAnonymous]
        [HttpPost("fbLogin")]
        public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
        {
            //verify access token received is for our FB App
            var fbverifyKeys = _config["Facebook:AppId"] + "|" + _config["Facebook:ApiSecret"];
            var verifyTokenResponse = await _httpClient
                                        .GetAsync($"debug_token?input_token={accessToken}&access_token={fbverifyKeys}");

            if (!verifyTokenResponse.IsSuccessStatusCode) return Unauthorized();

            //once verified get the fb user profile
            var fbUrl = $"me?access_token={accessToken}&fileds=name,email,picture.width(100).height(100)";

            var fbInfo = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

            //get the existing user from Db and return it if it exists
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == fbInfo.Email);

            if (user != null) return CreateUserObject(user);

            //if user doesn't exist create new user and persist in Db
            user = new AppUser
            {
                DisplayName = fbInfo.Name,
                Email = fbInfo.Email,
                UserName = fbInfo.Email,
                Photos = new List<Photo>
                {
                    new Photo
                    {
                        Id = "fb_" + fbInfo.Id,
                        Url = fbInfo.Picture.Data.Url,
                        IsMain = true
                    }
                }
            };

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem creating user account");

            return CreateUserObject(user);
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }
    }
}
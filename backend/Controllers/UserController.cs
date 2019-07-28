using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Controllers
{
	public class LoginFields
	{
		public string id;
		public string password;
	}

	public class SetPasswordFields
	{
		public string oldPassword;
		public string newPassword;
	}

	[Route("api/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		private readonly UserService _userService;

		public UserController(UserService userService)
		{
			_userService = userService;
		}

		[IsLogged]
		[HttpGet]
		public ActionResult<string> Get() => "1234";

		[Route("login")]
		[HttpPost]
		public ActionResult<User> Login(LoginFields login)
		{
			var jwtService = Request.HttpContext.RequestServices.GetService<JwtService>();
			var user = _userService.Get(login.id);

			if (user == null)
				return NotFound();

			if (!_userService.VerifyPassword(user.Id, login.password))
				return Unauthorized();

			try
			{
				Response.HttpContext.Session.SetString("token", jwtService.WriteToken(user.Id.ToString()));
			}
			catch
			{
				return BadRequest();
			}

			return user;
		}

		[IsLogged]
		[Route("password")]
		[HttpPost]
		public ActionResult<User> SetPassword(SetPasswordFields setPassword)
		{
			if (Request.HttpContext.Items["user"] == null)
				return BadRequest();

			User user = (User) Request.HttpContext.Items["user"];

			if (!_userService.VerifyPassword(user.Id, setPassword.oldPassword))
				return Unauthorized();

			_userService.SetPassword(user.Id, setPassword.newPassword);
			return user;
		}
	}
}

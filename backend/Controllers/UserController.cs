using System;
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
		public string username;
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

		[Authenticate]
		[HttpGet]
		public ActionResult<User> Get() => (User) Request.HttpContext.Items["user"];

		[Route("login")]
		[HttpPost]
		public ActionResult<User> Login(LoginFields login)
		{
			var jwtService = Request.HttpContext.RequestServices.GetService<JwtService>();
			var user = _userService.GetByUserName(login.username);

			if (user == null)
				return NotFound();

			if (!_userService.VerifyPassword(user.Id, login.password))
				return Unauthorized();

			try
			{
				Response.HttpContext.Session.SetString("token", jwtService.WriteToken(user.Id.ToString()));
			}
			catch (Exception e)
			{
				Console.WriteLine("Unable to write session JWT: " + e.ToString());
				return BadRequest();
			}

			return user;
		}

		[Authenticate]
		[Route("logout")]
		[HttpGet]
		public ActionResult Logout()
		{
			Response.HttpContext.Session.SetString("token", "");
			return Redirect("/");
		}

		[Authenticate]
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

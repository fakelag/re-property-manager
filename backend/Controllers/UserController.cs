using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
	public class LoginFields
	{
		public string id;
		public string password;
	}

	public class SetPasswordFields
	{
		public string id;
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

		[HttpGet]
		public ActionResult<string> Get() => "1234";

		[Route("login")]
		[HttpPost]
		public ActionResult<User> Login(LoginFields login)
		{
			var user = _userService.Get(login.id);

			if (user == null)
				return NotFound();

			if (!_userService.VerifyPassword(user.Id, login.password))
				return Unauthorized();

			return user;
		}

		[Route("password")]
		[HttpPost]
		public ActionResult<User> SetPassword(SetPasswordFields setPassword)
		{
			var user = _userService.Get(setPassword.id);

			if (user == null)
				return NotFound();

			_userService.SetPassword(user.Id, setPassword.newPassword);
			return user;
		}
	}
}

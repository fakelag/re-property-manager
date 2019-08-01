using System;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Attributes
{
	[AttributeUsageAttribute(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
	public class Authenticate : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext ctx)
		{
			ctx.HttpContext.Items["user"] = null;

			var userService = ctx.HttpContext.RequestServices.GetService<UserService>();
			var jwtService = ctx.HttpContext.RequestServices.GetService<JwtService>();
			var backendSettings = ctx.HttpContext.RequestServices.GetService<BackendSettings>();

			var jwtToken = ctx.HttpContext.Session.GetString("token");

			if (jwtToken == null || jwtToken.Length <= 0)
			{
				ctx.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.Forbidden);
				return;
			}

			try
			{
				var userId = jwtService.ReadToken(jwtToken);
				ctx.HttpContext.Items["user"] = userService.Get(userId);
			}
			catch (Exception e)
			{
				Console.WriteLine("Error decoding JWT: " + e.ToString());
				ctx.Result = new StatusCodeResult((int)System.Net.HttpStatusCode.InternalServerError);
				return;
			}
		}
	}
}

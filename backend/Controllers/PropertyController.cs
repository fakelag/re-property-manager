using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PropertyController : ControllerBase
	{
		private readonly PropertyService _propertyService;

		public PropertyController(PropertyService propertyService)
		{
			_propertyService = propertyService;
		}

		[IsLogged]
		[HttpGet]
		public ActionResult<List<Property>> Get()
		{
			var user = (User) Request.HttpContext.Items["user"];
			return _propertyService.ListByUser(user.Id);
		}

		[IsLogged]
		[HttpGet("{id:length(24)}", Name = "GetProperty")]
		public ActionResult<Property> Get(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];
			Property property = _propertyService.Get(id, user.Id);

			if (property == null)
				return NotFound();

			return property;
		}

		[IsLogged]
		[HttpPut]
		public ActionResult<Property> Create(Property property)
		{
			var user = (User) Request.HttpContext.Items["user"];

			property.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			property.Owner = user.Id;

			_propertyService.Create(property);

			return CreatedAtRoute("GetProperty", new { id = property.Id.ToString() }, property);
        }

		[IsLogged]
		[HttpPost("{id:length(24)}")]
		public ActionResult Update(string id, Property propertyIn)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Property property = _propertyService.Get(id, user.Id);

			if (property == null)
				return NotFound();

			propertyIn.Id = property.Id;
			propertyIn.Owner = property.Owner;
			_propertyService.Update(id, propertyIn);
			return NoContent();
		}

		[IsLogged]
		[HttpDelete("{id:length(24)}")]
		public ActionResult Delete(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Property property = _propertyService.Get(id, user.Id);

			if (property == null)
				return NotFound();

			_propertyService.Remove(property.Id);
			return NoContent();
		}
	}
}
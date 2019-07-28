using backend.Models;
using backend.Services;
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

		[HttpGet]
		public ActionResult<List<Property>> Get() => _propertyService.Get();

		[HttpGet("{id:length(24)}", Name = "GetProperty")]
		public ActionResult<Property> Get(string id)
		{
			Property property = _propertyService.Get(id);

			if (property == null)
				return NotFound();

			return property;
		}

		[HttpPut]
		public ActionResult<Property> Create(Property property)
		{
			property.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			_propertyService.Create(property);

			return CreatedAtRoute("GetProperty", new { id = property.Id.ToString() }, property);
        }

		[HttpPost("{id:length(24)}")]
		public ActionResult Update(string id, Property propertyIn)
		{
			Property property = _propertyService.Get(id);

			if (property == null)
				return NotFound();

			_propertyService.Update(id, propertyIn);
			return NoContent();
		}

		[HttpDelete("{id:length(24)}")]
		public ActionResult Delete(string id)
		{
			Property property = _propertyService.Get(id);

			if (property == null)
				return NotFound();

			_propertyService.Remove(property.Id);
			return NoContent();
		}
	}
}
using System;
using System.Linq;
using System.Collections.Generic;
using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
	public class CreateContractFields
	{
		public string propertyId;
		public RentalContract contract;
	}

	public class UpdateContractFields
	{
		public string propertyId;
		public string contractId;
		public RentalContract contract;
	}

	[Route("api/[controller]")]
	[ApiController]
	public class ContractController : ControllerBase
	{
		private readonly PropertyService _propertyService;
		private readonly ContractService _contractService;

		public ContractController(PropertyService propertyService, ContractService contractService)
		{
			_propertyService = propertyService;
			_contractService = contractService;
		}

		[IsLogged]
		[Route("list")]
		[HttpGet]
		public ActionResult<List<RentalContract>> List()
		{
			User user = (User) Request.HttpContext.Items["user"];

			var properties = _propertyService.ListByUser(user.Id);
			return properties.ConvertAll(prop => prop.Contracts).SelectMany(ct => ct).ToList();
		}

		[IsLogged]
		[HttpGet("{id:length(24)}")]
		public ActionResult<RentalContract> Get(string id)
		{
			Console.WriteLine("get contraccc= " + id);
			User user = (User) Request.HttpContext.Items["user"];

			var properties = _propertyService.ListByUser(user.Id);

			foreach (Property prop in properties)
			{
				var contract = prop.Contracts.Find(ct => ct.Id == id);

				if (contract != null)
					return contract;
			}

			return NotFound();
		}

		[IsLogged]
		[HttpPut]
		public ActionResult<RentalContract> Create(CreateContractFields createContract)
		{
			var user = (User) Request.HttpContext.Items["user"];

			var property = _propertyService.Get(createContract.propertyId, user.Id);

			if (property == null)
				return NotFound();

			createContract.contract.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			createContract.contract.Property = property.Id;

			_contractService.Create(property, createContract.contract);
			return createContract.contract;
		}

		[IsLogged]
		[HttpPost]
		public ActionResult<RentalContract> Update(UpdateContractFields updateContract)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Property property = _propertyService.Get(updateContract.propertyId, user.Id);

			if (property == null)
				return NotFound();

			RentalContract contract = property.Contracts.Find(ct => ct.Id == updateContract.contractId);

			if (contract == null)
				return NotFound();

			updateContract.contract.Id = contract.Id;
			updateContract.contract.Property = property.Id;

			_contractService.Update(property, updateContract.contract.Id, updateContract.contract);
			return updateContract.contract;
		}
	}
}

using System;
using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
	public class InvoiceCreationFields
	{
		public string description;
		public string linkedContract;
		public int amount;
		public DateTime dueDate;
	}

	[Route("api/[controller]")]
	[ApiController]
	public class InvoiceController : ControllerBase
	{
		private readonly InvoiceService _invoiceService;
		private readonly MongoService _mongoService;
		private readonly IBackendSettings _settings;

		public InvoiceController(IBackendSettings settings, InvoiceService invoiceService, MongoService mongoService)
		{
			_invoiceService = invoiceService;
			_mongoService = mongoService;
			_settings = settings;
		}

		[Authenticate]
		[HttpGet]
		public ActionResult<List<Invoice>> Get()
		{
			var user = (User) Request.HttpContext.Items["user"];
			return _invoiceService.ListByUser(user.Id);
		}

		[Authenticate]
		[HttpGet("{id:length(24)}", Name = "GetInvoice")]
		public ActionResult<Invoice> Get(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];
			Invoice invoice = _invoiceService.Get(id, user.Id);

			if (invoice == null)
				return NotFound();

			return invoice;
		}

		[Authenticate]
		[HttpPut]
		public ActionResult<Invoice> Create(InvoiceCreationFields invoiceCreation)
		{
			var user = (User) Request.HttpContext.Items["user"];

			try
			{
				Invoice invoice = _invoiceService.Create(user.Id, invoiceCreation.amount,
					_settings.Currency, invoiceCreation.dueDate, invoiceCreation.description,
					invoiceCreation.linkedContract);

				return CreatedAtRoute("GetInvoice", new { id = invoice.Id.ToString() }, invoice);
			}
			catch (Exception e)
			{
				switch (e.Message)
				{
					case "link_contract_not_found":
						return NotFound();
					default:
						throw e;
				}
			}
        }

		[Authenticate]
		[HttpDelete("{id:length(24)}")]
		public ActionResult Delete(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Invoice invoice = _invoiceService.Get(id, user.Id);

			if (invoice == null)
				return NotFound();

			_invoiceService.Remove(invoice.Id);
			return Ok();
		}
	}
}
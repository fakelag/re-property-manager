using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TransactionController : ControllerBase
	{
		private readonly TransactionService _transactionService;

		public TransactionController(TransactionService transactionService)
		{
			_transactionService = transactionService;
		}

		[Authenticate]
		[HttpGet]
		public ActionResult<List<Transaction>> Get()
		{
			var user = (User) Request.HttpContext.Items["user"];
			return _transactionService.ListByUser(user.Id);
		}

		[Authenticate]
		[HttpGet("{id:length(24)}", Name = "GetTransaction")]
		public ActionResult<Transaction> Get(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];
			Transaction transaction = _transactionService.Get(id, user.Id);

			if (transaction == null)
				return NotFound();

			return transaction;
		}

		[Authenticate]
		[HttpPut]
		public ActionResult<Transaction> Create(Transaction transaction)
		{
			var user = (User) Request.HttpContext.Items["user"];

			_transactionService.Create(user.Id, transaction);
			return CreatedAtRoute("GetTransaction", new { id = transaction.Id.ToString() }, transaction);
        }

		[Authenticate]
		[Route("many")]
		[HttpPut]
		public ActionResult<Transaction[]> CreateMany(Transaction[] transactionList)
		{
			var user = (User) Request.HttpContext.Items["user"];
			return _transactionService.CreateMany(user.Id, transactionList);
        }

		[Authenticate]
		[HttpPost("{id:length(24)}")]
		public ActionResult<Transaction> Update(string id, Transaction transactionIn)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Transaction transaction = _transactionService.Get(id, user.Id);

			if (transaction == null)
				return NotFound();

			transactionIn.Id = transaction.Id;
			transactionIn.Owner = transaction.Owner;

			_transactionService.Update(id, transactionIn);
			return transactionIn;
		}

		[Authenticate]
		[HttpDelete("{id:length(24)}")]
		public ActionResult Delete(string id)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Transaction transaction = _transactionService.Get(id, user.Id);

			if (transaction == null)
				return NotFound();

			_transactionService.Remove(transaction.Id);
			return Ok();
		}
	}
}
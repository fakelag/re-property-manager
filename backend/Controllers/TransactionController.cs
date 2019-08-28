using System;
using backend.Models;
using backend.Services;
using backend.Attributes;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace backend.Controllers
{
	public class UpdateTransactionFields
	{
		public string id;
		public Transaction transaction;
	}

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
		public ActionResult<Transaction[]> CreateMany([FromBody] Transaction[] transactionList)
		{
			var user = (User) Request.HttpContext.Items["user"];
			return _transactionService.CreateMany(user.Id, transactionList);
        }

		[Authenticate]
		[HttpPost("{id:length(24)}")]
		public ActionResult<Transaction> Update(UpdateTransactionFields updateTransaction)
		{
			var user = (User) Request.HttpContext.Items["user"];

			Transaction transaction = _transactionService.Get(updateTransaction.id, user.Id);

			if (transaction == null)
				return NotFound();

			updateTransaction.transaction.Id = transaction.Id;
			updateTransaction.transaction.Owner = transaction.Owner;

			try
			{
				return _transactionService.Update(updateTransaction.id, updateTransaction.transaction);
			}
			catch (Exception e)
			{
				// todo: handle this
				throw e;
			}
		}

		[Authenticate]
		[Route("many")]
		[HttpPost("{id:length(24)}")]
		public ActionResult<Transaction[]> UpdateMany([FromBody] UpdateTransactionFields[] updateTransactionList)
		{
			var user = (User) Request.HttpContext.Items["user"];

			var updatedTransactions = new List<Transaction>();
			foreach (UpdateTransactionFields updateTransaction in updateTransactionList)
			{
				Transaction transaction = _transactionService.Get(updateTransaction.id, user.Id);

				if (transaction == null)
					continue;

				updateTransaction.transaction.Id = transaction.Id;
				updateTransaction.transaction.Owner = transaction.Owner;

				try
				{
					updatedTransactions.Add(_transactionService.Update(updateTransaction.id,
						updateTransaction.transaction));
				}
				catch (Exception e)
				{
					// todo: handle this
					throw e;
				}
			}

			return updatedTransactions.ToArray();
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
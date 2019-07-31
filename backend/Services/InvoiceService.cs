using System;
using System.Collections.Generic;
using MongoDB.Driver;
using backend.Models;

namespace backend.Services
{
	public class InvoiceService
	{
		private readonly IMongoCollection<Invoice> _invoices;

		public InvoiceService(IDatabaseSettings settings, MongoService service)
		{
			_invoices = service.GetDatabase().GetCollection<Invoice>(settings.Collections.Invoices);
		}

		public Invoice Get(string id) => _invoices.Find(inv => inv.Id == id).FirstOrDefault();
		public Invoice Get(string id, string userId) => _invoices.Find(inv => inv.Id == id && inv.Owner == userId).FirstOrDefault();
		public List<Invoice> ListByUser(string userId) => _invoices.Find(inv => inv.Owner == userId).ToList();

		public Invoice Create(string ownerId, Decimal amount,
			string currency, DateTime dueDate, string description = "", ObjectLink linkedObject = null)
		{
			Invoice newInvoice = new Invoice();

			newInvoice.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			newInvoice.Amount = amount;
			newInvoice.CreationDate = DateTime.Today;
			newInvoice.Currency = currency;
			newInvoice.Description = description;
			newInvoice.DueDate = dueDate;
			newInvoice.AmountPaid = 0.0M;
			newInvoice.Owner = ownerId;
			newInvoice.LinkedTo = linkedObject;

			_invoices.InsertOne(newInvoice);
			return newInvoice;
		}

        public Invoice Update(string id, Invoice invoice)
		{
			Invoice inv = Get(id);

			if (inv == null)
				return null;

			invoice.Id = inv.Id;
			_invoices.ReplaceOne(nv => nv.Id == invoice.Id, invoice);

			return invoice;
		}

        public void Remove(string id)
		{
			_invoices.FindOneAndDelete(inv => inv.Id == id);
		}
	}
}
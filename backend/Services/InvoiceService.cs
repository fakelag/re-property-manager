using System;
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
	}
}
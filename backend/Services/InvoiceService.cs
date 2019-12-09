using System;
using System.Collections.Generic;
using MongoDB.Driver;
using backend.Models;

namespace backend.Services
{
	public class InvoiceService
	{
		private readonly IMongoCollection<Invoice> _invoices;
		private readonly TransactionService _transactionService;
		private readonly ContractService _contractService;

		public InvoiceService(IDatabaseSettings settings, MongoService mongoService,
			ContractService contractService, TransactionService transactionService)
		{
			_invoices = mongoService.GetDatabase().GetCollection<Invoice>(settings.Collections.Invoices);
			_contractService = contractService;
			_transactionService = transactionService;
		}

		public Invoice Get(string id) =>
			UpdateAmountPaid(_invoices.Find(inv => inv.Id == id).FirstOrDefault(), _transactionService.List());

		public Invoice Get(string id, string userId) =>
			UpdateAmountPaid(_invoices.Find(inv => inv.Id == id && inv.Owner == userId).FirstOrDefault(), _transactionService.ListByUser(userId));

		public List<Invoice> ListByUser(string userId) =>
			UpdateAmountsPaid(_invoices.Find(inv => inv.Owner == userId).ToList(), _transactionService.ListByUser(userId));

		public List<Invoice> ListByContract(string userId, string contractId) =>
			UpdateAmountsPaid(_invoices.Find(inv => inv.Owner == userId && inv.Contract == contractId).ToList(),
				_transactionService.ListByUser(userId));

		public Invoice Create(string ownerId, int amount,
			string currency, DateTime dueDate, string description = "",
			string linkedContract = null)
		{
			if (linkedContract != null)
			{
				// verify contract exists
				var contract = _contractService.Get(ownerId, linkedContract);

				if (contract == null)
					throw new Exception("link_contract_not_found");
			}

			Invoice newInvoice = new Invoice();

			newInvoice.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			newInvoice.Amount = amount;
			newInvoice.CreationDate = DateTime.Today;
			newInvoice.Currency = currency;
			newInvoice.Description = description;
			newInvoice.DueDate = dueDate;
			newInvoice.AmountPaid = 0;
			newInvoice.Owner = ownerId;
			newInvoice.Contract = linkedContract;

			_invoices.InsertOne(newInvoice);
			return newInvoice;
		}

        public Invoice Update(string invoiceId, string ownerId, int amount,
			string currency, DateTime dueDate, string description = "",
			string linkedContract = null)
		{
			Invoice invoice = Get(invoiceId, ownerId);

			if (invoice == null)
				throw new Exception("invoice_not_found");

			if (linkedContract != null)
			{
				// verify contract exists
				var contract = _contractService.Get(ownerId, linkedContract);

				if (contract == null)
					throw new Exception("link_contract_not_found");
			}

			invoice.Amount = amount;
			invoice.Currency = currency;
			invoice.Description = description;
			invoice.DueDate = dueDate;
			invoice.AmountPaid = 0;
			invoice.Contract = linkedContract;

			_invoices.ReplaceOne(nv => nv.Id == invoice.Id, invoice);

			return UpdateAmountPaid(invoice, _transactionService.ListByUser(invoice.Owner));
		}

        public void Remove(string id)
		{
			_invoices.FindOneAndDelete(inv => inv.Id == id);
		}

		public void UpdateContractInvoices(RentalContract contract)
		{
			var property = _contractService.GetProperty(contract);
			var invoiceList = ListByContract(property.Owner, contract.Id);

			var endDate = contract.EndDate != null ? contract.EndDate : DateTime.Now;
			var beginDate = contract.BeginDate;

			// var firstPaymentDOM = beginDate.Day > contract.PaymentDayOfMonth
		}

		private Invoice UpdateAmountPaid(Invoice invoice, List<Transaction> transactions)
		{
			if (invoice == null)
				return null;

			foreach (Transaction tr in transactions)
			{
				foreach (TransactionPart part in tr.Parts)
				{
					if (part.Invoice != invoice.Id)
						continue;

					invoice.AmountPaid += part.Amount;
				}
			}

			return invoice;
		}

		private List<Invoice> UpdateAmountsPaid(List<Invoice> invoices, List<Transaction> transactions)
		{
			return invoices.ConvertAll((invoice) => {
				return UpdateAmountPaid(invoice, transactions);
			});
		}
	}
}
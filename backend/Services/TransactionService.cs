using System;
using backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class TransactionService
    {
        private readonly IMongoCollection<Transaction> _transactions;

        public TransactionService(IDatabaseSettings settings, MongoService service)
        {
            _transactions = service.GetDatabase().GetCollection<Transaction>(settings.Collections.Transactions);
        }

        public Transaction Get(string id) => _transactions.Find(tr => tr.Id == id).FirstOrDefault();
		public Transaction Get(string id, string userId) => _transactions.Find(tr => tr.Id == id && tr.Owner == userId).FirstOrDefault();
        public List<Transaction> ListByUser(string userId) => _transactions.Find(tr => tr.Owner == userId).ToList();
		public List<Transaction> List() => _transactions.Find(tr => true).ToList();

        public Transaction Create(string userId, Transaction transaction)
		{
			transaction.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
			transaction.Owner = userId;
			transaction.Parts = new TransactionPart[0];

			_transactions.InsertOne(transaction);
			return transaction;
		}

		public Transaction[] CreateMany(string userId, Transaction[] transactionList)
		{
			Transaction[] insertList = new Transaction[transactionList.Length];

			if (transactionList.Length == 0)
				return insertList;

			for (var i = 0; i < transactionList.Length; ++i)
			{
				insertList[i] = transactionList[i];
				insertList[i].Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
				insertList[i].Owner = userId;
				insertList[i].Parts = new TransactionPart[0];
			}

			_transactions.InsertMany(insertList);
			return insertList;
		}

        public Transaction Update(string id, Transaction transaction)
		{
			var isNegative = transaction.Amount < 0;
			var totalCents = 0;

			foreach (var part in transaction.Parts)
			{
				if (isNegative && part.Amount > 0)
					throw new Exception("tr_parts_positive_in_negative");
				else if (!isNegative && part.Amount < 0)
					throw new Exception("tr_parts_negative_in_positive");

				totalCents += part.Amount;

				if (isNegative && totalCents < transaction.Amount)
					throw new Exception("tr_parts_total_amount_too_low");
				else if (!isNegative && totalCents > transaction.Amount)
					throw new Exception("tr_parts_total_amount_too_high");
			}

			_transactions.ReplaceOne(tr => tr.Id == id, transaction);
			return transaction;
		}

        public void Remove(Transaction transactionIn) => _transactions.DeleteOne(tr => tr.Id == transactionIn.Id);
        public void Remove(string id) => _transactions.DeleteOne(tr => tr.Id == id);
    }
}

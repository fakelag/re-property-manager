using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class TransactionPart
	{
		[BsonElement("invoice")]
		[JsonProperty("invoice")]
		public string Invoice { get; set; }

		[BsonElement("amount")]
		[JsonProperty("amount")]
		public int Amount { get; set; }
	}

	public class Transaction
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("owner")]
		[JsonProperty("owner")]
		public string Owner { get; set; }

		[BsonElement("amount")]
		[JsonProperty("amount")]
		public int Amount { get; set; }

		[BsonElement("date")]
		[JsonProperty("date")]
		public DateTime Date { get; set; }

		[BsonElement("currency")]
		[JsonProperty("currency")]
		public string Currency { get; set; }

		[BsonElement("description")]
		[JsonProperty("description")]
		public string Description { get; set; }

		[BsonElement("parts")]
		[JsonProperty("parts")]
		public TransactionPart[] Parts { get; set; }
	}
}
using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class Invoice
	{
		public Invoice()
		{
			AmountPaid = 0;
		}

		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("owner")]
		[JsonProperty("owner")]
		public string Owner { get; set; }

		[BsonElement("amount")]
		[JsonProperty("amount")]
		public int Amount { get; set; }

		[BsonIgnore]
		[JsonProperty("amountPaid")]
		public int AmountPaid { get; set; }

		[BsonElement("currency")]
		[JsonProperty("currency")]
		public string Currency { get; set; }

		[BsonElement("description")]
		[JsonProperty("description")]
		public string Description { get; set; }

		[BsonElement("creationDate")]
		[JsonProperty("creationDate")]
		public DateTime CreationDate { get; set; }

		[BsonElement("dueDate")]
		[JsonProperty("dueDate")]
		public DateTime DueDate { get; set; }

		[BsonElement("linkedContract")]
		[JsonProperty("linkedContract")]
		public string Contract { get; set; }
	}
}
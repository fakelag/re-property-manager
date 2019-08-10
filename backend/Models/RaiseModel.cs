using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class ContractRaise
	{
		[BsonElement("costIndexDate")]
		[JsonProperty("costIndexDate")]
		public DateTime CostIndexDate { get; set; }
	}
}
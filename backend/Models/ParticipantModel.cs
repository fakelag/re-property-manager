using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class ContractParticipant
	{
		[BsonElement("fullName")]
		[JsonProperty("fullName")]
		public string FullName { get; set; }

		[BsonElement("email")]
		[JsonProperty("email")]
		public string Email { get; set; }

		[BsonElement("phone")]
		[JsonProperty("phone")]
		public string Phone { get; set; }

		[BsonElement("ssn")]
		[JsonProperty("ssn")]
		public string Ssn { get; set; }

		[BsonElement("address")]
		[JsonProperty("address")]
		public string Address { get; set; }
	}
}
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class Property
	{
		[BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

		[BsonElement("address")]
		[JsonProperty("address")]
		public string Address { get; set; }

		[BsonElement("owner")]
		[JsonProperty("owner")]
		public string Owner { get; set; }
	}
}

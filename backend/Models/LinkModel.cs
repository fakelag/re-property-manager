using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class ObjectLink
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("collection")]
		[JsonProperty("collection")]
		public string Collection { get; set; }

		[BsonElement("linkedObject")]
		[JsonProperty("linkedObject")]
		public string LinkedObject { get; set; }
	}
}
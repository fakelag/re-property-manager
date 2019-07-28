using Newtonsoft.Json;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
	public class User
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("username")]
		[JsonProperty("username")]
		public string Username { get; set; }

		[BsonElement("password")]
		[JsonIgnore]
		public string Password { get; set; }
	}
}

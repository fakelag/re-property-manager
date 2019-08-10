using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;

namespace backend.Models
{
	public class SecurityDeposit
	{
		[BsonElement("depositAmount")]
		[JsonProperty("depositAmount")]
		[JsonRequired]
		public int DepositAmount { get; set; }

		[BsonElement("depositDate")]
		[JsonProperty("depositDate")]
		[JsonRequired]
		public DateTime DepositDate { get; set; }
	}

	public class RentalContract
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public string Id { get; set; }

		[BsonElement("property")]
		[JsonProperty("property")]
		public string Property { get; set; }

		[BsonElement("beginDate")]
		[JsonProperty("beginDate")]
		[JsonRequired]
		public DateTime BeginDate { get; set; }

		[BsonElement("endDate")]
		[JsonProperty("endDate")]
		public DateTime? EndDate { get; set; } // null = infinite

		[BsonElement("paymentAmount")]
		[JsonProperty("paymentAmount")]
		[JsonRequired]
		public int PaymentAmount { get; set; }

		[BsonElement("paymentDateOfMonth")]
		[JsonProperty("paymentDateOfMonth")]
		[JsonRequired]
		public int PaymentDateOfMonth { get; set; }

		[BsonElement("paymentRaise")]
		[JsonProperty("paymentRaise")]
		public ContractRaise PaymentRaise { get; set; }

		[BsonElement("securityDeposit")]
		[JsonProperty("securityDeposit")]
		public SecurityDeposit SecurityDeposit { get; set; }

		[BsonElement("additionalConditions")]
		[JsonProperty("additionalConditions")]
		[JsonRequired]
		public string AdditionalConditions { get; set; }

		[BsonElement("additionalEquipment")]
		[JsonProperty("additionalEquipment")]
		[JsonRequired]
		public string AdditionalEquipment { get; set; }

		[BsonElement("signDate")]
		[JsonProperty("signDate")]
		public DateTime SignDate { get; set; }

		[BsonElement("participant")]
		[JsonProperty("participant")]
		[JsonRequired]
		public ContractParticipant Participant { get; set; }
	}
}
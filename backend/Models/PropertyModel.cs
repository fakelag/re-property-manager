using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace backend.Models
{
	public class Property
	{
		public Property()
		{
			Contracts = new List<RentalContract>();
		}

		[BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

		[BsonElement("address")]
		[JsonProperty("address")]
		[JsonRequired]
		public string Address { get; set; }

		[BsonElement("city")]
		[JsonProperty("city")]
		[JsonRequired]
		public string City { get; set; }

		[BsonElement("zip")]
		[JsonProperty("zip")]
		[JsonRequired]
		public string Zip { get; set; }

		[BsonElement("debtFreePrice")]
		[JsonProperty("debtFreePrice")]
		[JsonRequired]
		public int DebtFreePrice { get; set; }

		[BsonElement("sellingPrice")]
		[JsonProperty("sellingPrice")]
		[JsonRequired]
		public int SellingPrice { get; set; }

		[BsonElement("maintenanceFee")]
		[JsonProperty("maintenanceFee")]
		[JsonRequired]
		public int MaintenanceFee { get; set; }

		[BsonElement("financeFee")]
		[JsonProperty("financeFee")]
		[JsonRequired]
		public int FinanceFee { get; set; }

		[BsonElement("repairFee")]
		[JsonProperty("repairFee")]
		[JsonRequired]
		public int RepairFee { get; set; }

		[BsonElement("apartmentType")]
		[JsonProperty("apartmentType")]
		[JsonRequired]
		public string ApartmentType { get; set; }

		[BsonElement("livingArea")]
		[JsonProperty("livingArea")]
		[JsonRequired]
		public Decimal LivingArea { get; set; }

		[BsonElement("owner")]
		[JsonProperty("owner")]
		public string Owner { get; set; }

		[BsonElement("contracts")]
		[JsonProperty("contracts")]
		public List<RentalContract> Contracts { get; set; }
	}
}

using System;
using System.Linq;
using backend.Models;
using MongoDB.Driver;

namespace backend.Services
{
    public class ContractService
    {
        private readonly IMongoCollection<Property> _properties;

        public ContractService(IDatabaseSettings settings, MongoService service)
        {
            _properties = service.GetDatabase().GetCollection<Property>(settings.Collections.Properties);
        }

		public RentalContract Get(Property property, string contractId) => property.Contracts.Find(contract => contract.Id == contractId);

		public RentalContract Get(string contractId)
		{
			var propertyList = _properties.Find(prop => true).ToList();

			foreach (var property in propertyList)
			{
				foreach (var contract in property.Contracts)
				{
					if (contract.Id == contractId)
						return contract;
				}
			}

			return null;
		}

		public RentalContract Get(string userId, string id)
		{
			var propertyList = _properties.Find(prop => prop.Owner == userId).ToList();

			foreach (var property in propertyList)
			{
				foreach (var contract in property.Contracts)
				{
					if (contract.Id == id)
						return contract;
				}
			}

			return null;
		}

		public RentalContract Create(Property property, RentalContract contract)
		{
			contract.Property = property.Id;
			property.Contracts.Add(contract);

			var update = Builders<Property>.Update.Set("contracts", property.Contracts);
			_properties.FindOneAndUpdate<Property>(prop => prop.Id == property.Id, update);

			return contract;
		}

        public RentalContract Update(Property property, string contractId, RentalContract contract)
		{
			var index = property.Contracts.FindIndex(rc => rc.Id == contractId);

			if (index == -1)
				throw new Exception("update_property_not_found");

			property.Contracts[index] = contract;
			property.Contracts[index].Property = property.Id;

			var update = Builders<Property>.Update.Set("contracts", property.Contracts);
			_properties.FindOneAndUpdate<Property>(prop => prop.Id == property.Id, update);

			return property.Contracts[index];
		}

        public void Remove(Property property, string id)
		{
			var index = property.Contracts.FindIndex(rc => rc.Id == id);

			if (index == -1)
				return;

			property.Contracts.RemoveAt(index);

			var update = Builders<Property>.Update.Set("contracts", property.Contracts);
			_properties.FindOneAndUpdate<Property>(prop => prop.Id == property.Id, update);
		}
    }
}

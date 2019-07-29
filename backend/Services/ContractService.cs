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

		public RentalContract Get(Property property, string id) => property.Contracts.Find(contract => contract.Id == id);

		public void Create(Property property, RentalContract contract)
		{
			contract.Property = property.Id;
			property.Contracts.Append(contract);

			var update = Builders<Property>.Update.Set("contracts", property.Contracts);
			_properties.FindOneAndUpdate<Property>(prop => prop.Id == property.Id, update);
		}

        public void Update(Property property, string id, RentalContract contract)
		{
			var index = property.Contracts.FindIndex(rc => rc.Id == id);

			if (index == -1)
				throw new Exception("Update property not found");

			property.Contracts[index] = contract;
			property.Contracts[index].Property = property.Id;

			var update = Builders<Property>.Update.Set("contracts", property.Contracts);
			_properties.FindOneAndUpdate<Property>(prop => prop.Id == property.Id, update);
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

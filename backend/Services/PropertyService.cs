using backend.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services
{
    public class PropertyService
    {
        private readonly IMongoCollection<Property> _properties;

        public PropertyService(IDatabaseSettings settings, MongoService service)
        {
            _properties = service.GetDatabase().GetCollection<Property>(settings.Collections.Properties);
        }

        public Property Get(string id) => _properties.Find(property => property.Id == id).FirstOrDefault();
		public Property Get(string id, string userId) => _properties.Find(property => property.Id == id && property.Owner == userId).FirstOrDefault();
        public List<Property> ListByUser(string userId) => _properties.Find(property => property.Owner == userId).ToList();
		public List<Property> List() => _properties.Find(property => true).ToList();
        public void Create(Property property) => _properties.InsertOne(property);
        public void Update(string id, Property propertyIn) => _properties.ReplaceOne(property => property.Id == id, propertyIn);
        public void Remove(Property propertyIn) => _properties.DeleteOne(property => property.Id == propertyIn.Id);
        public void Remove(string id) => _properties.DeleteOne(property => property.Id == id);
    }
}

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

        public List<Property> Get() =>
            _properties.Find(property => true).ToList();

        public Property Get(string id) =>
            _properties.Find<Property>(property => property.Id == id).FirstOrDefault();

        public Property Create(Property property)
        {
            _properties.InsertOne(property);
            return property;
        }

        public void Update(string id, Property propertyIn) =>
            _properties.ReplaceOne(property => property.Id == id, propertyIn);

        public void Remove(Property propertyIn) =>
            _properties.DeleteOne(property => property.Id == propertyIn.Id);

        public void Remove(string id) => 
            _properties.DeleteOne(property => property.Id == id);
    }
}
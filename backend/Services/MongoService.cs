using backend.Models;
using MongoDB.Driver;

namespace backend.Services
{
	public class MongoService
	{
		private MongoClient _client;
		private IMongoDatabase _database;
		public MongoService(IDatabaseSettings settings)
		{
			_client = new MongoClient(settings.ConnectionString);
            _database = _client.GetDatabase(settings.DatabaseName);
		}

		public MongoClient GetClient() => _client;
		public IMongoDatabase GetDatabase() => _database;
	}
}
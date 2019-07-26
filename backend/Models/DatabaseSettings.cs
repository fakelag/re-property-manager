namespace backend.Models
{
	public class DatabaseCollections
	{
		public string Properties { get; set; }
		public string Users { get; set; }
	}
	public interface IDatabaseSettings
	{
		string ConnectionString { get; set; }
		string DatabaseName { get; set; }

		DatabaseCollections Collections { get; set; }
	}
	public class DatabaseSettings : IDatabaseSettings
	{
		public string ConnectionString { get; set; }
		public string DatabaseName { get; set; }
		public DatabaseCollections Collections { get; set; }
	}
}
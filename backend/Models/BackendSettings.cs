namespace backend.Models
{
	public interface IBackendSettings
	{
		string JwtSecret { get; set; }
		int JwtLifeTimeMinutes { get; set; }
		int SessionLifeTimeMinutes { get; set; }
		string Currency { get; set; }
	}

	public class BackendSettings : IBackendSettings
	{
		public string JwtSecret { get; set; }
		public int JwtLifeTimeMinutes { get; set; }
		public int SessionLifeTimeMinutes { get; set; }
		public string Currency { get; set; }
	}
}

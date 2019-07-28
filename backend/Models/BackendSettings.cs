namespace backend.Models
{
	public interface IBackendSettings
	{
		string JwtSecret { get; set; }
	}

	public class BackendSettings : IBackendSettings
	{
		public string JwtSecret { get; set; }
	}
}

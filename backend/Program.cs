using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace backend
{
    public class Program
    {
		public static void Main(string[] args)
		{
			var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
			var isDevelopment = environment == EnvironmentName.Development;

			var host = WebHost.CreateDefaultBuilder(args)
				.UseWebRoot(Path.Combine(Directory.GetCurrentDirectory(),
					"../frontend/.dist/bundle", isDevelopment ? "dev" : "prod"))
				.UseKestrel()
				.UseIISIntegration()
				.UseStartup<Startup>()
				.Build();

			host.Run();
		}
    }
}

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

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

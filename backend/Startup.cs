using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using backend.Models;
using backend.Services;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
			services.Configure<CookiePolicyOptions>(options =>
			{
				options.CheckConsentNeeded = context => false;
				options.MinimumSameSitePolicy = SameSiteMode.None;
			});

			// Map backend settings
			services.Configure<BackendSettings>(Configuration.GetSection(nameof(BackendSettings)));
			services.AddSingleton<IBackendSettings>(sp => sp.GetRequiredService<IOptions<BackendSettings>>().Value);

			// Map database settings
			services.Configure<DatabaseSettings>(Configuration.GetSection(nameof(DatabaseSettings)));
			services.AddSingleton<IDatabaseSettings>(sp => sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);

			// Map services
			services.AddSingleton<MongoService>();
			services.AddSingleton<JwtService>();
			services.AddSingleton<PropertyService>();
			services.AddSingleton<UserService>();

			services.AddMvc()
				.AddSessionStateTempDataProvider()
				.SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

			// Sessions
			services.AddDistributedMemoryCache();
			services.AddSession(options =>
			{
				options.IdleTimeout = TimeSpan.FromMinutes(Convert.ToDouble(Configuration["BackendSettings:SessionLifeTimeMinutes"]));
				options.Cookie.HttpOnly = true;
				options.Cookie.IsEssential = true;
				options.Cookie.Name = "re-manager-session";
				options.Cookie.SameSite = SameSiteMode.None;
			});
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
				app.UseHttpsRedirection();
            }

			app.UseCookiePolicy();
			app.UseSession();
            app.UseMvc();
        }
    }
}

﻿using System;
using System.IO;
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
			services.AddSingleton<ContractService>();
			services.AddSingleton<InvoiceService>();
			services.AddSingleton<TransactionService>();
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

			// SPA
			app.Use(async (context, next) =>
			{
				await next();
				var path = context.Request.Path.Value;

				if (!path.StartsWith("/api") && !Path.HasExtension(path))
				{
					context.Request.Path = "/index.html";
					await next();
				}
			});

			app.UseDefaultFiles();
			app.UseStaticFiles();

			app.UseCookiePolicy();
			app.UseSession();
			app.UseMvc();

			if (env.IsDevelopment())
			{
				var serviceProvider = app.ApplicationServices;
				var userService = serviceProvider.GetService<UserService>();

				userService.CreateAdminUser("fakelag", "123");
			}
        }
    }
}

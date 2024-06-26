using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PawledgerAPI.Context;
using PawledgerAPI.Repositories;
using PawledgerAPI.Services;
using PawledgerAPI.Worker;

namespace PawledgerAPI
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<DataContext>(options =>
          options.UseNpgsql(Configuration.GetConnectionString("PawLedgerDb")));
      services.AddControllers();
      services.AddScoped<PetRepository>();
      services.AddScoped<MedicalHistoryRepository>();
      services.AddScoped<BlockChainService>();
      services.AddScoped<MedicalHistoryService>();
      services.AddTransient<AccountService>();
      services.AddTransient<AccountRepository>();
      services.AddHostedService<BlockChainWorker>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
      dataContext.Database.Migrate();
      app.UseCors(options =>
        options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
      );

      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        // app.UseHsts();
      }
      app.UseHttpsRedirection();
      app.UseStaticFiles();
      app.UseRouting();
      app.UseAuthorization();
      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });

    }
  }
}

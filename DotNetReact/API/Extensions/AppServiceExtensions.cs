using API.Middleware;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class AppServiceExtensions
    {
        public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddTransient<ExceptionHandlingMiddleware>();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            services.AddAuthentication();
            services.AddAuthentication();
            services.AddControllers( opt => {
                var policy = new AuthorizationPolicyBuilder()
                                .RequireAuthenticatedUser()
                                .Build();
                //applies auth filter to the actions/methods from the controllers instead of using [Authorize] Attribute but doesn't display lock icon in swagger so better to use [Authorize]
                opt.Filters.Add(new AuthorizeFilter(policy)); 
            });

            services.AddDbContext<DataContext>( opt => {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policy => policy.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());
            });
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfile).Assembly);
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();

            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            return services;
        }
    }
}
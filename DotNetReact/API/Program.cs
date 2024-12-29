using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

builder.Services.AddEndpointsApiExplorer()
                .AddSwaggerGen()
                .AddAppServices(builder.Configuration)
                .AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

// prevent browsers from interpreting files as a different MIME type than what is specified by the server. This helps mitigate certain types of attacks, such as MIME sniffing,
app.UseXContentTypeOptions();

//Controls how much information is shared when navigating from your domain to an external site
app.UseReferrerPolicy(opt => opt.NoReferrer());

//blocking cross side scripting
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());

// blocking iframe
app.UseXfo(opt => opt.Deny());

app.UseCsp(opt => opt
    .BlockAllMixedContent()
    // we're gonna allow below sources from our domain
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com",
    "sha256-yChqzBduCCi4o4xdbXRXh4U/t1rP4UUUMJt+rB+ylUI="))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com", "https://www.facebook.com", "data:"))
    .ScriptSources(s => s.Self()
        .CustomSources(
            "sha256-RZa9FeBeiqCM2+5jcE1mUKMkRZ69RNcOg/OAT6NWJ7Y=",
            "sha256-rTuNa9UeAQ5B9gj9rLEY9243ZbVE6Sl++AiPas66JE4=",
            "https://connect.facebook.net"
        )
    )
);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        // tells browsers to only interact with your site over HTTPS for a specified duration
        context.Response.Headers.Append("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chat");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>(); //gets userManager for AppUser to inject the service into SeedData method
    context.Database.Migrate(); //runs migration to create tables in db
    await Seed.SeedData(context, userManager);

}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migrations");
}

app.Run("http://localhost:5000/"); //5000 for SignalR ws
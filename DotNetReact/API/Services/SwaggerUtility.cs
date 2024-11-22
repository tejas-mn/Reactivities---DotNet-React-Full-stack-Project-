using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace API.Extensions
{
    public class AuthorizationHeaderParameterOperationFilter: IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (context.ApiDescription.ActionDescriptor is ControllerActionDescriptor descriptor)
            {
                if (!context.ApiDescription.CustomAttributes().Any((a) => a is AllowAnonymousAttribute)
                    && (context.ApiDescription.CustomAttributes().Any((a) => a is AuthorizeAttribute)
                        || descriptor.ControllerTypeInfo.GetCustomAttribute<AuthorizeAttribute>() != null))
                {
                    if (operation.Security == null) operation.Security = new List<OpenApiSecurityRequirement>();

                    operation.Security.Add(
                        new OpenApiSecurityRequirement{{
                            new OpenApiSecurityScheme {
                                Name = "Authorization",
                                In = ParameterLocation.Header,
                                BearerFormat = "Bearer token",

                                Reference = new OpenApiReference{
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },                            
                            new string[]{ }
                        }
                    });
                }
            }
        }
    }

    
}
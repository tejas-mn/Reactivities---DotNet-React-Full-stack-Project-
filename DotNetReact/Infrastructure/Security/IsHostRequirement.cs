using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {
        
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _httpContext;
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext;
            _httpContext = httpContextAccessor;
        }

        protected override async Task<Task> HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if(userId == null) return Task.CompletedTask;

            //getting activity id from http request
            var activityId = Guid.Parse(_httpContext.HttpContext?.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value?.ToString());

            //get the currently logged in user from attendance for current activity
            var attendee = _dbContext.ActivityAttendees
                                        .AsNoTracking() //to resolve bug for not getting attendee in response
                                        .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
                                        .Result;

            if(attendee == null) return Task.CompletedTask;
            
            //if for activity current user is host then he is authorized
            if(attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
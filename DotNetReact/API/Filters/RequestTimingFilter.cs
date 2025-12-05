using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class RequestTimingAttribute : TypeFilterAttribute
    {
        public RequestTimingAttribute() : base(typeof(RequestTimingFilter)) { }
    }
    
    public class RequestTimingFilter : IAsyncActionFilter
    {
        private readonly ILogger<RequestTimingFilter> _logger;

        public RequestTimingFilter(ILogger<RequestTimingFilter> logger) => _logger = logger;

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var sw = Stopwatch.StartNew();
            var executedContext = await next();
            sw.Stop();

            var ms = sw.ElapsedMilliseconds;
            _logger.LogInformation("\u001b[31m Request {Path} executed in {Elapsed}ms", context.HttpContext.Request.Path, ms);

            // Expose timing to clients
            context.HttpContext.Response.Headers["X-Elapsed-Ms"] = ms.ToString();
        }
    }
}
using System.Diagnostics;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Behaviours
{
    public class CommandLoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ILogger<CommandLoggingBehavior<TRequest, TResponse>> _logger;

        public CommandLoggingBehavior(ILogger<CommandLoggingBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            string reqSerialized;
            try { reqSerialized = JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = false }); }
            catch { reqSerialized = request?.ToString() ?? "<null>"; }

            var sw = Stopwatch.StartNew();
            var response = await next();
            sw.Stop();

            string respSerialized;
            try { respSerialized = JsonSerializer.Serialize(response, new JsonSerializerOptions { WriteIndented = false }); }
            catch { respSerialized = response?.ToString() ?? "<null>"; }

            var secs = sw.Elapsed.TotalSeconds.ToString("F3");
            _logger.LogInformation("\u001b[33m MediatR Request: {Request} | RequestType: {RequestType} | Response: {Response} | Took(s): {Seconds}",
                reqSerialized, requestName, respSerialized, secs);

            return response;
        }
    }
}
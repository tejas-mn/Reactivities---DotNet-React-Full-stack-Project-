using System.Diagnostics;
using System.Text.Json;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Application.Behaviours
{
    public class CommandLoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ILogger<CommandLoggingBehavior<TRequest, TResponse>> _logger;
        private readonly IReadOnlyDictionary<Type, Type> _handlerTypes;

        public CommandLoggingBehavior(
            ILogger<CommandLoggingBehavior<TRequest, TResponse>> logger,
            IReadOnlyDictionary<Type, Type> handlerTypes)
        {
            _logger = logger;
            _handlerTypes = handlerTypes;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;
            var handlerServiceType = typeof(IRequestHandler<,>).MakeGenericType(typeof(TRequest), typeof(TResponse));
            var handlerName = _handlerTypes.TryGetValue(handlerServiceType, out var handlerType)
                ? handlerType.FullName ?? handlerType.Name
                : "Unresolved";

            string reqSerialized;
            try { reqSerialized = JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = false }); }
            catch { reqSerialized = request?.ToString() ?? "<null>"; }

            _logger.LogInformation("MediatR Request: {Request} | RequestType: {RequestType} | Handler: {HandlerType}",
                reqSerialized, requestName, handlerName);

            var sw = Stopwatch.StartNew();
            var response = await next();
            sw.Stop();

            string respSerialized;
            try { respSerialized = JsonSerializer.Serialize(response, new JsonSerializerOptions { WriteIndented = false }); }
            catch { respSerialized = response?.ToString() ?? "<null>"; }

            var secs = sw.Elapsed.TotalSeconds.ToString("F3");
            _logger.LogInformation("MediatR Response: {Response} | RequestType: {RequestType} | Handler: {HandlerType} | Took(s): {Seconds}",
                respSerialized, requestName, handlerName, secs);

            return response;
        }
    }
}
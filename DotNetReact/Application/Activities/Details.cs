using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity>
        {
            public Guid Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            
            public Handler(DataContext context, ILogger<Details> logger)
            {
                _logger = logger;
                _context = context;
            }

            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                try{
                    for(int i=0;i<10;i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested(); //If Handling the request takes time and is still running after user has canceled request then here it will throw ex to stop
                        await Task.Delay(1000, cancellationToken);
                        _logger.LogInformation($"Task {i} completed");
                    }
                }catch (Exception)
                {
                    _logger.LogInformation($"A Task was canceled");
                }

                return await _context.Activities.FindAsync(request.Id);
            }
        }
    }
}
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<Details> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                _logger = logger;
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    // for (int i = 0; i < 10; i++)
                    // {
                    //     cancellationToken.ThrowIfCancellationRequested(); //If Handling the request takes time and is still running after user has canceled request then here it will throw ex to stop
                    //     await Task.Delay(1000, cancellationToken);
                    //     _logger.LogInformation($"Task {i} completed");
                    // }

                    var activity = await _context.Activities
                                               .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider,
                                                    new { currentUserName = _userAccessor.GetUserName() })
                                                .FirstOrDefaultAsync(x => x.Id == request.Id);

                    return Result<ActivityDto>.Success(activity);

                }
                catch (Exception ex)
                {
                    _logger.LogInformation($"A Task was canceled");
                    return Result<ActivityDto>.Failure(ex.Message);
                }
            }
        }
    }
}
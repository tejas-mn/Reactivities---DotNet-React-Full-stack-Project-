using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _context.Activities
                                                .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                                               //    .Include(a => a.Attendees)
                                               //    .ThenInclude(a => a.AppUser)
                                               .ToListAsync(cancellationToken);

                    // var activities = _mapper.Map<List<ActivityDto>>(result);

                    return Result<List<ActivityDto>>.Success(result);
                }
                catch (Exception ex)
                {
                    return Result<List<ActivityDto>>.Failure(ex.Message);
                }

            }
        }
    }
}
using Application.Core;
using Application.Interfaces;
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
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _mapper = mapper;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _context.Activities
                                               .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                                                        new {currentUserName = _userAccessor.GetUserName()})
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
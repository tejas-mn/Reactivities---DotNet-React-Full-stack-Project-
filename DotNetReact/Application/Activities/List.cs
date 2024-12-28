using Applcation.Core;
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
        public class Query : IRequest<Result<PagedList<ActivityDto>>> 
        { 
            public ActivityParams Params {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
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

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var query = _context.Activities
                                    .Where(d => d.Date > request.Params.StartDate)
                                    .OrderBy(d => d.Date)
                                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, 
                                            new {currentUserName = _userAccessor.GetUserName()})
                                    //    .Include(a => a.Attendees)
                                    //    .ThenInclude(a => a.AppUser)
                                    .AsQueryable();

                    if(request.Params.isGoing && !request.Params.IsHost)
                    {
                        query = query.Where(x => x.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
                    }

                    if(request.Params.IsHost && !request.Params.isGoing)
                    {
                        query = query.Where(x => x.HostUserName == _userAccessor.GetUserName());
                    }

                    // var activities = _mapper.Map<List<ActivityDto>>(result);

                    return Result<PagedList<ActivityDto>>.Success(
                        await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                    );
                }
                catch (Exception ex)
                {
                    return Result<PagedList<ActivityDto>>.Failure(ex.Message);
                }

            }
        }
    }
}
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {}

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    var result = await _context.Activities.ToListAsync();
                    return Result<List<Activity>>.Success(result);
                }
                catch (Exception ex)
                {
                    return Result<List<Activity>>.Failure(ex.Message);
                }
                
            }
        }
    }
}
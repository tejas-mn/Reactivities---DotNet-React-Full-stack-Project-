using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                _context = context;
                _accessor = accessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //get activity to update
                var activity = await _context.Activities
                                    .Include(a => a.Attendees)
                                    .ThenInclude(a => a.AppUser)
                                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null) return null;

                //get current logged in user
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _accessor.GetUserName());

                if (user == null) return null;

                //get the host of the activity to compare with logged in user
                var HostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                //get the ActivityAttendee entry for current user
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                //If current user is host then he can cancel the activity (toggling the attend/cancel if current user)
                if (attendance != null && HostUserName == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }

                //If current user is not host and has attendence then remove from attendees
                if (attendance != null && HostUserName != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }

                //If current user doesn't have any ActivityAttendee add new entry
                if (attendance == null)
                {
                    attendance = new Domain.ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to update attendance");
            }
        }
    }
}
using Application.Activities;
using Domain;

namespace Application.Core
{
  public class MappingProfile : AutoMapper.Profile
  {
    public string currentUserName = null;
    
    public MappingProfile()
    {
      Console.WriteLine("DEBUG" + currentUserName);
      CreateMap<Activity, Activity>()
         .ForAllMembers(opt =>
           opt.Condition((src, dest, srcMember) =>
               srcMember != null &&
                 (!(srcMember is DateTime) || (DateTime?)srcMember != DateTime.MinValue)  //to keep the destination as it is if property not passed (null / min date) in request while updating
     ));

      CreateMap<ActivityAttendee, AttendeeDto>()
        .ForMember(d => d.DisplayName, p => p.MapFrom(s => s.AppUser.DisplayName))
        .ForMember(d => d.UserName, p => p.MapFrom(s => s.AppUser.UserName))
        .ForMember(d => d.Bio, p => p.MapFrom(s => s.AppUser.Bio))
        .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
        .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
        .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
        .ForMember(d => d.Following,
            o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));

      CreateMap<Activity, ActivityDto>()
        .ForMember(d => d.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

      CreateMap<AppUser, Profiles.Profile>()
        .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
        .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
        .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
        .ForMember(d => d.Following,
            o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUserName)));

      CreateMap<Comment, CommentDto>()
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
        .ForMember(d => d.UserName, o => o.MapFrom(s => s.Author.UserName))
        .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
    }
  }
}
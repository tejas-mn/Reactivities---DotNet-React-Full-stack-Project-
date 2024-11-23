using Application.Activities;
using Domain;

namespace Application.Core
{
  public class MappingProfile : AutoMapper.Profile
  {
    public MappingProfile()
    {
      CreateMap<Activity, Activity>()
         .ForAllMembers(opt =>
           opt.Condition((src, dest, srcMember) =>
               srcMember != null &&
                 (!(srcMember is DateTime) || (DateTime?)srcMember != DateTime.MinValue)  //to keep the destination as it is if property not passed (null / min date) in request while updating
     ));

      CreateMap<ActivityAttendee, Profiles.Profile>()
        .ForMember(d => d.DisplayName, p => p.MapFrom(s => s.AppUser.DisplayName))
        .ForMember(d => d.UserName, p => p.MapFrom(s => s.AppUser.UserName))
        .ForMember(d => d.Bio, p => p.MapFrom(s => s.AppUser.Bio));

      CreateMap<Activity, ActivityDto>()
        .ForMember(d => d.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
    }
  }
}
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfile : Profile
    {
       public MappingProfile()
       {
         CreateMap<Activity,Activity>()
            .ForAllMembers(opt => 
              opt.Condition((src, dest, srcMember) => 
                  srcMember != null && 
                    (!(srcMember is DateTime) || (DateTime?)srcMember != DateTime.MinValue)  //to keep the destination as it is if property not passed (null / min date) in request while updating
        ));
       }
    }
}
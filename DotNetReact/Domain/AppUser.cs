using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public ICollection<ActivityAttendee> Activities { get; set; } //reference join table also as activities here
        public ICollection<Photo> Photos { get; set; }
        public ICollection<UserFollowing> Followings {get; set;}
        public ICollection<UserFollowing> Followers {get; set;}
        public ICollection<RefreshToken> RefreshTokens {get; set;} = new List<RefreshToken>();
    }
}
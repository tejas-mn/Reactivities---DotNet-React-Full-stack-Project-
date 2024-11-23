namespace Domain
{
    public class ActivityAttendee //joint table for m:n relationship from AppUser and Activity table
    {
        public string AppUserId { get; set; } //fk
        public AppUser AppUser { get; set; }
        public Guid ActivityId { get; set; } //fk
        public Activity Activity { get; set; }
        public bool IsHost { get; set; }
    }
}
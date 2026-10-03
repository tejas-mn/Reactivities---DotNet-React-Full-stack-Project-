namespace API.SignalR
{
    public class PrivateChatMessageDto
    {
        public string Id { get; set; } = string.Empty;
        public string SenderUserName { get; set; } = string.Empty;
        public string RecipientUserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }

    public class MessageConversationDto
    {
        public string PartnerUserName { get; set; } = string.Empty;
        public string LastMessage { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
    }
}
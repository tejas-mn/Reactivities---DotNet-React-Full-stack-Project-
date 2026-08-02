using System.Collections.Concurrent;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        private readonly IMediator _mediator;
        private static readonly ConcurrentDictionary<string, string> ConnectionUsers = new();
        private static readonly ConcurrentDictionary<string, List<PrivateChatMessageDto>> Conversations = new();

        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command)
        {
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString())
                .SendAsync("ReceiveComment", comment.Value);
        }

        public async Task LoadConversation(string otherUserName)
        {
            var currentUserName = Context.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(currentUserName) || string.IsNullOrWhiteSpace(otherUserName))
            {
                return;
            }

            var key = GetConversationKey(currentUserName, otherUserName);
            var conversation = Conversations.GetValueOrDefault(key, new List<PrivateChatMessageDto>());

            await Clients.Caller.SendAsync("LoadConversation", conversation);
        }

        public async Task SendPrivateMessage(string recipientUserName, string content)
        {
            var senderUserName = Context.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(senderUserName) || string.IsNullOrWhiteSpace(recipientUserName) || string.IsNullOrWhiteSpace(content))
            {
                return;
            }

            var message = new PrivateChatMessageDto
            {
                Id = Guid.NewGuid().ToString(),
                SenderUserName = senderUserName,
                RecipientUserName = recipientUserName,
                Content = content.Trim(),
                CreatedAt = DateTime.UtcNow.ToString("O")
            };

            var conversationKey = GetConversationKey(senderUserName, recipientUserName);
            AddMessage(conversationKey, message);

            var recipientConnectionIds = ConnectionUsers.Where(x => x.Value.Equals(recipientUserName, StringComparison.OrdinalIgnoreCase))
                .Select(x => x.Key)
                .ToList();

            if (recipientConnectionIds.Count > 0)
            {
                await Clients.Clients(recipientConnectionIds).SendAsync("ReceivePrivateMessage", message);
            }

            await Clients.Caller.SendAsync("ReceivePrivateMessage", message);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var activityId = httpContext?.Request.Query["activityId"].ToString();

            if (!string.IsNullOrWhiteSpace(activityId))
            {
                if (Guid.TryParse(activityId, out var parsedActivityId))
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, parsedActivityId.ToString());
                    var result = await _mediator.Send(new List.Query { ActivityId = parsedActivityId });
                    await Clients.Caller.SendAsync("LoadComments", result.Value);
                }
            }
            else
            {
                var userName = Context.User?.Identity?.Name;
                if (!string.IsNullOrWhiteSpace(userName))
                {
                    ConnectionUsers[Context.ConnectionId] = userName;
                }
            }

            await base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectionUsers.TryRemove(Context.ConnectionId, out _);
            return base.OnDisconnectedAsync(exception);
        }

        private static void AddMessage(string conversationKey, PrivateChatMessageDto message)
        {
            if (!Conversations.ContainsKey(conversationKey))
            {
                Conversations[conversationKey] = new List<PrivateChatMessageDto>();
            }

            Conversations[conversationKey].Add(message);
        }

        private static string GetConversationKey(string userOne, string userTwo)
        {
            var ordered = new[] { userOne, userTwo }
                .OrderBy(x => x, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            return $"{ordered[0]}::{ordered[1]}";
        }
    }

    public class PrivateChatMessageDto
    {
        public string Id { get; set; } = string.Empty;
        public string SenderUserName { get; set; } = string.Empty;
        public string RecipientUserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
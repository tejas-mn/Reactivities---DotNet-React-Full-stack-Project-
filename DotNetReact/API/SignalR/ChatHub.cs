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

            var key = ChatConversationStore.GetConversationKey(currentUserName, otherUserName);
            var conversation = ChatConversationStore.GetConversation(key);

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

            var conversationKey = ChatConversationStore.GetConversationKey(senderUserName, recipientUserName);
            ChatConversationStore.AddMessage(conversationKey, message);

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
    }
}
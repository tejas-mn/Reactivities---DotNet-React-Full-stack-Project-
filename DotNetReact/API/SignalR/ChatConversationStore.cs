using System.Collections.Concurrent;
using System.Text.RegularExpressions;

namespace API.SignalR
{
    public static class ChatConversationStore
    {
        private static readonly ConcurrentDictionary<string, List<PrivateChatMessageDto>> Conversations = new();

        public static string GetConversationKey(string userOne, string userTwo)
        {
            var ordered = new[] { userOne, userTwo }
                .OrderBy(x => x, StringComparer.OrdinalIgnoreCase)
                .ToArray();

            return $"{ordered[0]}::{ordered[1]}";
        }

        public static void AddMessage(string conversationKey, PrivateChatMessageDto message)
        {
            if (!Conversations.ContainsKey(conversationKey))
            {
                Conversations[conversationKey] = new List<PrivateChatMessageDto>();
            }

            Conversations[conversationKey].Add(message);
        }

        public static IReadOnlyList<PrivateChatMessageDto> GetConversation(string conversationKey)
        {
            if (Conversations.TryGetValue(conversationKey, out var conversation))
            {
                return conversation;
            }

            return Array.Empty<PrivateChatMessageDto>();
        }

        public static List<MessageConversationDto> GetConversationsForUser(string userName)
        {
            var result = new List<MessageConversationDto>();

            foreach (var kvp in Conversations)
            {
                var key = kvp.Key;
                var messages = kvp.Value;

                if (!key.Contains("::", StringComparison.Ordinal))
                {
                    continue;
                }

                var parts = key.Split("::", StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length != 2)
                {
                    continue;
                }

                if (!parts.Any(p => p.Equals(userName, StringComparison.OrdinalIgnoreCase)))
                {
                    continue;
                }

                var partnerUserName = parts[0].Equals(userName, StringComparison.OrdinalIgnoreCase) ? parts[1] : parts[0];
                var lastMessage = messages.Count > 0 ? messages[^1].Content : string.Empty;
                var lastUpdated = messages.Count > 0 ? messages[^1].CreatedAt : string.Empty;

                result.Add(new MessageConversationDto
                {
                    PartnerUserName = partnerUserName,
                    LastMessage = lastMessage,
                    LastUpdated = lastUpdated
                });
            }

            return result.OrderByDescending(x => x.LastUpdated).ToList();
        }
    }
}

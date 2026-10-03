using API.SignalR;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseController
    {
        private readonly IUserAccessor _userAccessor;

        public MessagesController(IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
        }

        [HttpGet]
        public IActionResult GetConversations()
        {
            var userName = _userAccessor.GetUserName();
            if (string.IsNullOrWhiteSpace(userName))
            {
                return Unauthorized();
            }

            var conversations = ChatConversationStore.GetConversationsForUser(userName);
            return Ok(conversations);
        }
    }
}

using Application.Followers;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FollowController : BaseController
    {
        [HttpPost("{username}")]
        public async Task<IActionResult> Follow([FromRoute]string username) => 
            HandleResult(await Mediator.Send(new FollowToggle.Command { TargetUserName = username }));

        [HttpGet("{username}")]
        public async Task<IActionResult> GetFollowings(string username, string predicate) => 
            HandleResult(await Mediator.Send(new List.Query { UserName = username, Predicate = predicate }));
    }
}
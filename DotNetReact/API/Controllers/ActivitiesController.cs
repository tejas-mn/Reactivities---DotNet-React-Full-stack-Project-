using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ActivitiesController : BaseController
    {
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] ActivityParams param)
        {
            var result = await Mediator.Send(new List.Query {Params = param});
            return HandlePagedResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id, CancellationToken ct)
        {
            var result = await Mediator.Send(new Details.Query { Id = id }, ct);
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Activity activity)
        {
            var result = await Mediator.Send(new Create.Command { Activity = activity });
            return HandleResult(result);
        }

        // [Authorize(Policy = "IsActivityHost")] //only if current logged in user is host then can edit or delete activity
        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(Guid id, Activity activity)
        {
            activity.Id = id;
            var result = await Mediator.Send(new Edit.Command { Activity = activity });
            return HandleResult(result);
        }

        // [Authorize(Policy = "IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await Mediator.Send(new Delete.Command { Id = id });
            return HandleResult(result);
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)
        {
            var result = await Mediator.Send(new UpdateAttendance.Command { Id = id });
            return HandleResult(result);
        }
    }
}
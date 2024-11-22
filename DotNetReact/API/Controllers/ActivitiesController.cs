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
        public async Task<IActionResult> Get()
        {
            var result = await Mediator.Send(new List.Query());
            return HandleResult(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id, CancellationToken ct)
        {
            var result = await Mediator.Send(new Details.Query {Id = id}, ct);
            return HandleResult(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Activity activity)
        {
            var result = await Mediator.Send(new Create.Command {Activity = activity});
            return HandleResult(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(Guid id, Activity activity){
            activity.Id = id;
            var result = await Mediator.Send(new Edit.Command {Activity = activity});
            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id){
            var result = await Mediator.Send(new Delete.Command { Id = id });
            return HandleResult(result);
        }
    }
}
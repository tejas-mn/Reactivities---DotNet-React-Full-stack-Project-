using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> Get()
        {
           return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Get([FromRoute] Guid id, CancellationToken ct)
        {
            return await Mediator.Send(new Details.Query {Id = id}, ct);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] Activity activity)
        {
            await Mediator.Send(new Create.Command {Activity = activity});
            return Ok("Created");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(Guid id, Activity activity){
            activity.Id = id;
            await Mediator.Send(new Edit.Command {Activity = activity});
            return Ok("Edited");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id){
            await Mediator.Send(new Delete.Command { Id = id });
            return Ok("Deleted");
        }
    }
}
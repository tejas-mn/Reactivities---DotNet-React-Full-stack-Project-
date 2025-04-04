using API.Extensions;
using Applcation.Core;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;
        protected IMediator Mediator => _mediator ??= 
            HttpContext.RequestServices.GetService<IMediator>();

            protected ActionResult HandleResult<T>(Result<T> result)
            {
                if(result == null) return NotFound();

                if(result.IsSucess && result.Value != null)
                {
                    return Ok(result.Value);
                }
                else if(result.IsSucess && result.Value == null)
                {
                    return NotFound();
                }
                return BadRequest(result.Error);
            }
            protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
            {
                if(result == null) return NotFound();
                
                if(result.IsSucess && result.Value != null)
                {
                    Response.AddPaginationHeader(result.Value.CurrentPage, result.Value.PageSize, result.Value.TotalCount, result.Value.TotalPages);
                    return Ok(result.Value);
                }

                if(result.IsSucess && result.Value == null)
                {
                    return NotFound();
                }
                return BadRequest(result.Error);
            }
    }
}
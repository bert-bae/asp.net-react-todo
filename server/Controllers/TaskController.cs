using System.Collections.Generic;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TaskList.Models;
using TaskList.Services;

namespace TaskList.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class TaskController : ControllerBase
  {
    private readonly IMapper _mapper;
    public TaskController(IMapper mapper)
    {
      var config = new MapperConfiguration(cfg => cfg.CreateMap<TaskDto, Task>()
        .ForMember(dest => dest.name, opt => opt.Condition((src, dest) => src.name != null))
        .ForMember(dest => dest.description, opt => opt.Condition((src, dest) => src.description != null))
        .ForMember(dest => dest.isComplete, opt => opt.Condition((src, dest) => src.isComplete != null)));
      _mapper = config.CreateMapper();
    }

    [HttpGet]
    public ActionResult<List<Task>> GetAll()
    {
      return TaskService.GetAll();
    }

    [HttpGet("{id}", Name = "GetTaskById")]
    public ActionResult<Task> Get(System.Guid id)
    {
      var task = TaskService.Get(id);
      if (task == null)
      {
        return NotFound();
      }
      return task;
    }

    [HttpPost(Name = nameof(Create))]
    public IActionResult Create([FromBody] Task task)
    {
      if (task.name == null)
      {
        return BadRequest();
      }

      var id = System.Guid.NewGuid();
      task.id = id;
      TaskService.Add(task);
      return CreatedAtRoute("GetTaskById", new { id = id }, task);
    }

    [HttpPut("{id}", Name = nameof(Update))]
    public ActionResult<Task> Update([FromRoute] System.Guid id, [FromBody] TaskDto data)
    {
      if (data == null)
      {
        return BadRequest();
      }

      Task existingTask = TaskService.Get(id);
      if (existingTask == null)
      {
        return NotFound();
      }

      var updatedTask = _mapper.Map<TaskDto, Task>(
        data,
        existingTask
      );
      TaskService.Update(updatedTask);
      return Ok(updatedTask);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete([FromRoute] System.Guid id)
    {
      TaskService.Delete(id);
      return Ok(new { id = id });
    }
  }
}
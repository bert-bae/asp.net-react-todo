using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TaskList.Models;
using TaskList.Services;

namespace TaskList.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class TaskController : ControllerBase
  {
    public TaskController()
    {

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

      var updatedTask = new Task
      {
        id = id,
        name = data.name,
        isComplete = data.isComplete,
        description = data.description
      };
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
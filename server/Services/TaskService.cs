using System.Collections.Generic;
using System.Linq;
using TaskList.Models;

namespace TaskList.Services
{
  public static class TaskService
  {
    static List<Task> Tasks { get; }
    static TaskService()
    {
      Tasks = new List<Task> {
        new Task { id = System.Guid.NewGuid(), name = "First task", description = "Some simple description", isComplete = false },
        new Task { id = System.Guid.NewGuid(), name = "Second task", description = "Some simple description", isComplete = false }
      };
    }

    public static List<Task> GetAll() => Tasks;
    public static Task Get(System.Guid id) => Tasks.Find(t => t.id == id);
    public static void Add(Task task)
    {
      task.id = System.Guid.NewGuid();
      Tasks.Add(task);
    }
    public static void Delete(System.Guid id)
    {
      var task = Get(id);
      if (task is Task)
      {
        Tasks.Remove(task);
      }
    }
    public static void Update(Task task)
    {
      var current = Tasks.Find(t => t.id == task.id);
      current = task;
    }
  }
}
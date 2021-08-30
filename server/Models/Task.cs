namespace TaskList.Models
{
  public class Task
  {
    public System.Guid id { get; set; }
    public string name { get; set; }
    public string description { get; set; }
    public bool isComplete { get; set; }
  }

  public class TaskDto
  {
    public string name { get; set; }
    public string description { get; set; }
    public bool? isComplete { get; set; }
  }
}
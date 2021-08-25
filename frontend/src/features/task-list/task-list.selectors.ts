import { RootState } from "../../app/store";
import { Task } from "./task-types";

export const selectTasks = (state: RootState): Task[] => {
  const tasks = [];
  const taskMap = state.taskList.tasks;

  for (const t in taskMap) {
    tasks.push(taskMap[t]);
  }
  return tasks;
};

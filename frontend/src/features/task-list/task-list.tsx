import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask, fetchTasks } from "./task-list.slice";
import { selectTasks } from "./task-list.selectors";
import TaskRow from "./components/task-row";
import TaskForm from "./components/task-form";

import "./task-list.scss";

const TaskList = () => {
  const tasks = useSelector(selectTasks);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  return (
    <div className="task-list">
      <h3>Task List</h3>
      <TaskForm
        submitLabel="Add"
        onClick={(name: string) => dispatch(addTask({ name }))}
      />
      {tasks.map((t) => {
        return <TaskRow {...t} key={t.id} />;
      })}
    </div>
  );
};

export default TaskList;

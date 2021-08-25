import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, toggleTask, updateDescription } from "../task-list.slice";
import { Task } from "../task-types";

const TaskRow: React.FC<Task> = (props) => {
  const [show, setShow] = React.useState(!props.completed);
  const dispatch = useDispatch();

  return (
    <div className={clsx("task-row", props.completed && "completed")}>
      <h5>{props.name}</h5>
      {props.completed && <div className="done-icon">Done</div>}
      <div className="task-actions">
        <button onClick={() => dispatch(toggleTask(props.id))}>
          Mark as {props.completed ? "Incomplete" : "Complete"}
        </button>
        <button
          aria-label="toggle-task-details"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Hide" : "Show"} details
        </button>
        <button onClick={() => dispatch(deleteTask(props.id))}>Delete</button>
      </div>
      {show && (
        <>
          <p>Description:</p>
          <textarea
            rows={5}
            value={props.description}
            onChange={(e) => dispatch(updateDescription(e.target.value))}
          />
        </>
      )}
    </div>
  );
};

export default TaskRow;

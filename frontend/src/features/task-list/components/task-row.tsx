import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask, toggleTask, updateDescription } from "../task-list.slice";
import { Task } from "../task-types";

const TaskRow: React.FC<Task> = (props) => {
  const [show, setShow] = React.useState(!props.isComplete);
  const dispatch = useDispatch();
  return (
    <div className={clsx("task-row", props.isComplete && "isComplete")}>
      <h5>{props.name}</h5>
      {props.isComplete && <div className="done-icon">Done</div>}
      <div className="task-actions">
        <button
          onClick={() =>
            dispatch(
              toggleTask({ id: props.id, isComplete: !props.isComplete })
            )
          }
        >
          Mark as {props.isComplete ? "Incomplete" : "Complete"}
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
            onChange={(e) =>
              dispatch(
                updateDescription({
                  id: props.id,
                  description: e.target.value,
                })
              )
            }
          />
        </>
      )}
    </div>
  );
};

export default TaskRow;

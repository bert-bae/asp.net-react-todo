import React from "react";

type TaskFormProps = {
  submitLabel: string;
  onClick(...args: any[]): void;
};

const TaskForm: React.FC<TaskFormProps> = (props) => {
  const [text, setText] = React.useState<string>("");

  const changeText = (e: any) => setText(e.target.value);

  return (
    <div className="task-form">
      <input type="text" onChange={changeText} value={text} />
      <button
        onClick={() => {
          props.onClick(text);
          setText("");
        }}
      >
        {props.submitLabel}
      </button>
    </div>
  );
};

export default TaskForm;

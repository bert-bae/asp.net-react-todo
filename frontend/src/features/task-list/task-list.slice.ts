import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "./task-types";

export const fetchTasks = createAsyncThunk("taskList/fetchTasks", async () => {
  const { data } = await axios.get("http://localhost:5000/task");
  const taskMap: Record<string, Task> = {};
  data.forEach((task: Task) => {
    taskMap[task.id] = task;
  });
  return taskMap;
});

const initialState: { tasks: Record<string, Task>; loading: boolean } = {
  tasks: {},
  loading: false,
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    addTask(state, action) {
      const taskId = action.payload.id as string;
      state.tasks[taskId] = action.payload;
    },
    toggleTask(state, action) {
      const task = state.tasks[action.payload];
      if (task) task.completed = !task.completed;
    },
    deleteTask(state, action) {
      delete state.tasks[action.payload];
    },
    updateDescription(state, action) {
      const task = state.tasks[action.payload];
      if (task) task.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
  },
});

export const { addTask, toggleTask, deleteTask, updateDescription } =
  taskListSlice.actions;

export default taskListSlice.reducer;

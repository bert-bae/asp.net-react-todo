import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../clients/api-client";
import { Task } from "./task-types";

export const fetchTasks = createAsyncThunk("taskList/fetchTasks", async () => {
  const { data } = await apiClient.get("/task");
  const taskMap: Record<string, Task> = {};
  data.forEach((task: Task) => {
    taskMap[task.id] = task;
  });
  return taskMap;
});

export const addTask = createAsyncThunk<Task, Pick<Task, "name">>(
  "taskList/addTask",
  async (task) => {
    const { data } = await apiClient.post("/task", {
      name: task.name,
    });
    return data;
  }
);

export const deleteTask = createAsyncThunk<{ id: string }, string>(
  "taskList/deleteTask",
  async (taskId: string) => {
    const { data } = await apiClient.delete(`/task/${taskId}`);
    return data;
  }
);

const initialState: { tasks: Record<string, Task>; loading: boolean } = {
  tasks: {},
  loading: false,
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    toggleTask(state, action) {
      const task = state.tasks[action.payload];
      if (task) task.completed = !task.completed;
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
      alert("Request failed");
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTask.rejected, (state) => {
      state.loading = false;
      alert("Request failed");
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      const taskId = action.payload.id as string;
      state.tasks[taskId] = action.payload;
    });
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTask.rejected, (state) => {
      state.loading = false;
      alert("Request failed");
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const taskId = action.payload.id;
      delete state.tasks[taskId];
    });
  },
});

export const { toggleTask, updateDescription } = taskListSlice.actions;

export default taskListSlice.reducer;

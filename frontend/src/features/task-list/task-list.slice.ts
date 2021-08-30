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

export const toggleTask = createAsyncThunk<
  Pick<Task, "id" | "isComplete">,
  Pick<Task, "id" | "isComplete">
>("taskList/toggleTask", async ({ id, isComplete }) => {
  await apiClient.put(`/task/${id}`, { isComplete });
  console.log("hello");
  console.log(isComplete);
  return { id, isComplete };
});

export const updateDescription = createAsyncThunk<
  Pick<Task, "id" | "description">,
  Pick<Task, "id" | "description">
>("taskList/updateDescription", async ({ id, description }) => {
  await apiClient.put(`/task/${id}`, { description });
  return {
    id,
    description,
  };
});

const initialState: { tasks: Record<string, Task>; loading: boolean } = {
  tasks: {},
  loading: false,
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    updateDescription(state, action) {
      const task = state.tasks[action.payload];
      if (task) task.description = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add
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
    // Get ALL
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload;
    });
    // Delete
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const taskId = action.payload.id;
      delete state.tasks[taskId];
    });
    // Toggle Complete
    builder.addCase(toggleTask.fulfilled, (state, action) => {
      const { id, isComplete } = action.payload;
      const task = state.tasks[id];
      task.isComplete = isComplete;
    });
    // Update description of task
    builder.addCase(updateDescription.fulfilled, (state, action) => {
      const { id, description } = action.payload;
      const task = state.tasks[id];
      task.description = description;
    });
  },
});

export default taskListSlice.reducer;

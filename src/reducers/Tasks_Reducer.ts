import { addTodolist_AC, changeTodolistEntityStatusAC, deleteTL_AC, getTodolists_AC } from "./Todolists_Reducer";
import { ModalType, taskAPI, TaskDomainType, UpdateModalType } from "../api/TaskAPI";
import { RootState } from "../store/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { resetData } from "common/actions/common.actions";
import { RequestStatusType } from "api/rtk_query_task_api";

export enum TaskActionType {
  DELETETASK = "DELETETASK",
  ADD_TASK = "ADD_TASK",
  GET_TASKS = "GET_TASKS",
  UPDATE_TASK = "UPDATE_TASK",
  CHANGE_TASK_ENTITY_STATUS = "CHANGE_TASK_ENTITY_STATUS",
}

export type ChangeTaskEntityStatusType = ReturnType<typeof changeTaskEntityStatusAC>;
export type TasksType = {
  [key: string]: Array<
    TaskDomainType & {
      entityStatus: RequestStatusType;
    }
  >;
};

let initialState: TasksType = {};
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatusAC: (
      state,
      action: PayloadAction<{ todoId: string; taskId: string; entityStatus: RequestStatusType }>,
    ) => {
      const triggerTaskIndex = state[action.payload.todoId].findIndex((task) => task.id === action.payload.taskId);
      if (triggerTaskIndex > -1) {
        state[action.payload.todoId][triggerTaskIndex].entityStatus = action.payload.entityStatus;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addTodolist_AC, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(resetData, () => {
        return {};
      })
      .addCase(deleteTL_AC, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(getTodolists_AC, (state, action) => {
        action.payload.todolists.forEach((todo) => {
          state[todo.id] = [];
        });
      })
      .addCase(getTasksTC.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((task) => ({ ...task, entityStatus: "idle" }));
      })
      .addCase(addTaskTC.fulfilled, (state, action) => {
        state[action.payload.todoListId].unshift({ ...action.payload, entityStatus: "idle" });
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const triggerTaskIndex = state[action.payload.todolistId].findIndex(
          (task) => task.id === action.payload.task.id,
        );
        state[action.payload.todolistId][triggerTaskIndex] = { ...action.payload.task, entityStatus: "idle" };
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const triggerTaskIndex = state[action.payload.todolistId].findIndex(
          (task) => task.id === action.payload.taskId,
        );
        state[action.payload.todolistId].splice(triggerTaskIndex, 1);
      });
  },
});

export const { changeTaskEntityStatusAC } = slice.actions;
export const reducerTasks = slice.reducer;
// Thunk creator

export const getTasksTC = createAsyncThunk("tasks/fetchGetTasks", async (todolistId: string) => {
  const { data } = await taskAPI.getTasks(todolistId);
  return {
    tasks: data.items,
    todolistId,
  };
});
export const addTaskTC = createAsyncThunk(
  "tasks/fetchAddTask",
  async (params: { todolistId: string; title: string }) => {
    const { data } = await taskAPI.createTask(params.todolistId, params.title);
    return data.data.item;
  },
);
export const updateTaskTC = createAsyncThunk(
  "tasks/updateTask",
  async (params: { todolistId: string; taskId: string; model: ModalType }, thunkAPI) => {
    const store = thunkAPI.getState() as RootState;
    // const task = store.tasks[params.todolistId].find((task) => task.id === params.taskId);
    let apiModel = {} as UpdateModalType;
    // if (!!task) {
    //   apiModel = {
    //     description: task.description,
    //     status: task.status,
    //     priority: task.priority,
    //     startDate: task.startDate,
    //     deadline: task.deadline,
    //     title: task.title,
    //     ...params.model,
    //   };
    // }
    const { data } = await taskAPI.updateTask(params.todolistId, params.taskId, apiModel);
    return {
      task: data.data.item,
      todolistId: params.todolistId,
    };
  },
);
export const deleteTaskTC = createAsyncThunk(
  "tasks/deleteTask",
  async (params: { todolistId: string; taskId: string }) => {
    await taskAPI.deleteTask(params.todolistId, params.taskId);
    return {
      todolistId: params.todolistId,
      taskId: params.taskId,
    };
  },
);

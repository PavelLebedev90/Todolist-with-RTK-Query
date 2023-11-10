import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusType } from "api/rtk_query_task_api";
import { TodolistAPIType } from "api/rtk_query_todo_api";
import { resetData } from "common/actions/common.actions";

export enum TLActionType {
  GET_TL = "GET_TL",
  DELETE_TL = "DELETE_TL",
  SET_FILTER = "SET_FILTER",
  ADD_TL = "ADD_TL",
  CHANGETITLE_TL = "CHANGETITLE_TL",
  CHANGE_TODOLIST_ENTITY_STATUS = "CHANGE_TODOLIST_ENTITY_STATUS",
  RESET_DATA = "RESET_DATA",
}

export type ChangeTodolistEntityStatusType = ReturnType<typeof changeTodolistEntityStatusAC>;

export type FilterValuesType = "all" | "active" | "completed";
export type TodosType = TodolistAPIType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

let initialState: Array<TodosType> = [];
const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    getTodolists_AC: (state, action: PayloadAction<{ todolists: TodosType[] }>) => {
      return [...action.payload.todolists];
    },
    addTodolist_AC: (state, action: PayloadAction<{ todolist: TodolistAPIType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    deleteTL_AC: (state, action: PayloadAction<{ id: string }>) => {
      const targetTodolistIndex = state.findIndex((todo) => todo.id === action.payload.id);
      state.splice(targetTodolistIndex, 1);
    },
    changeFilterTL_AC: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      state.forEach((todo) => {
        if (todo.id === action.payload.id) {
          todo.filter = action.payload.filter;
        }
      });
    },
    changeTitleTL_AC: (state, action: PayloadAction<{ id: string; title: string }>) => {
      state.forEach((todo) => {
        if (todo.id === action.payload.id) {
          todo.title = action.payload.title;
        }
      });
    },
    changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      state.forEach((todo) => {
        if (todo.id === action.payload.id) {
          todo.entityStatus = action.payload.entityStatus;
        }
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(resetData, (state) => {
      state.length = 0;
    });
  },
});
//reducerTL
export const {
  addTodolist_AC,
  changeFilterTL_AC,
  changeTitleTL_AC,
  changeTodolistEntityStatusAC,
  deleteTL_AC,
  getTodolists_AC,
} = slice.actions;
export const reducerTL = slice.reducer;
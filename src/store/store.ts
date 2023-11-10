import { combineReducers } from "redux";
import { reducerTasks } from "../reducers/Tasks_Reducer";
import { reducerTL } from "../reducers/Todolists_Reducer";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { RTK_api } from "api/baseQuery";

let rootReducer = combineReducers({
  [RTK_api.reducerPath]: RTK_api.reducer,
});

export let store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(RTK_api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//@ts-ignore
window.store = store;
setupListeners(store.dispatch);

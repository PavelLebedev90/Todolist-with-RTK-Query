import { RTK_api } from "./baseQuery";

 const todoApi = RTK_api.injectEndpoints({
  endpoints: (builder) => ({
    getTodolists: builder.query<TodolistAPIType[], void>({
      query: () => `/todo-lists`,
      providesTags: ["todo"],
    }),
    createTodolist: builder.mutation<CreateTLType, string>({
      query: title => ({url: `/todo-lists`, method: 'POST', body: {title}}),
      invalidatesTags: ["todo"]
    }),
    updateTodolist: builder.mutation<TodolistAPIType, {todolistId: string, title: string}>({
      query: (params) => ({url: `/todo-lists/${params.todolistId}`, method: 'PUT', body: params}),
      invalidatesTags: ["todo"]
    }),
    deleteTodolist: builder.mutation<void, string>({
      query: (todolistId) => ({url: `/todo-lists/${todolistId}`, method: 'DELETE', body: todolistId}),
      invalidatesTags: ["todo"]
    }),
  }),
});
export const { useGetTodolistsQuery, useCreateTodolistMutation, useDeleteTodolistMutation, useUpdateTodolistMutation } = todoApi;

export type TodolistAPIType = {
  addedDate: string;
  id: string;
  order: number;
  title: string;
};
type CreateTLType = {
  data: {
    item: TodolistAPIType;
  };
  resultCode: number;
  messages: string[];
};

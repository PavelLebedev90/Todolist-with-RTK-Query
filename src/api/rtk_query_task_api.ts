import { RTK_api } from "./baseQuery";

const taskApi = RTK_api.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TasksAPIType, string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map((item) => ({ type: "tasks", id: item.id })),
              { type: "tasks", id: result.items[0]?.todoListId ?? "LIST" },
            ]
          : [{ type: "tasks", id: "LIST" }];
      },
    }),
    createTask: builder.mutation<CreateTaskType, { todolistId: string; title: string }>({
      query: (params) => ({
        url: `/todo-lists/${params.todolistId}/tasks`,
        method: "POST",
        body: { title: params.title },
      }),
      invalidatesTags: (_, __, body) => [
        { type: "tasks", id: body.todolistId },
        { type: "tasks", id: "LIST" },
      ],
    }),
    updateTask: builder.mutation<
      CreateTaskType,
      { todolistId: string; taskId: string; model: Partial<UpdateModalType> }
    >({
      query: (params) => ({
        url: `/todo-lists/${params.todolistId}/tasks/${params.taskId}`,
        method: "PUT",
        body: params.model,
      }),
      invalidatesTags: (result) => [{ type: "tasks", id: result?.data.item.id }],
    }),
    deleteTask: builder.mutation<void, { todolistId: string; taskId: string }>({
      query: (params) => ({ url: `/todo-lists/${params.todolistId}/tasks/${params.taskId}`, method: "DELETE" }),
      invalidatesTags: (_, __, body) => [{ type: "tasks", id: body.taskId }],
    }),
  }),
});
export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = taskApi;
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type TasksType = {
  [key: string]: Array<TaskDomainType>;
};
export type ModalType = {
  title?: string;
  status?: TaskStatuses;
};

export type UpdateModalType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: number;
  startDate: string;
  deadline: string;
};

export type TaskDomainType = {
  addedDate: string;
  deadline: string;
  description: string;
  id: string;
  order: number;
  priority: number;
  startDate: string;
  status: TaskStatuses;
  title: string;
  todoListId: string;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export type TasksAPIType = {
  items: Array<TaskDomainType>;
};
type CreateTaskType = {
  data: {
    item: TaskDomainType;
  };
  resultCode: number;
  messages: string[];
};

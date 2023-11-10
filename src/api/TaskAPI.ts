import axios from "axios";

export const initialAPI = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  withCredentials: true,
  headers: {
    "api-key": "b9ab541c-e0c5-4e3f-a6cb-7e9f4deadb80",
  },
});

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
export const taskAPI = {
  getTasks(todolistId: string) {
    return initialAPI.get<TasksAPIType>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return initialAPI.post<CreateTaskType>(`/todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, modalTask: UpdateModalType) {
    return initialAPI.put<CreateTaskType>(`/todo-lists/${todolistId}/tasks/${taskId}`, modalTask);
  },
  deleteTask(todolistId: string, taskId: string) {
    return initialAPI.delete(`/todo-lists/${todolistId}/tasks/${taskId}`);
  },
};

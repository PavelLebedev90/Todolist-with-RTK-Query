import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const RTK_api = createApi({
  reducerPath: "init_api",
  tagTypes: ['user_me', 'todo', 'tasks'],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://social-network.samuraijs.com/api/1.1",
    credentials: "include",
    headers: {
      "api-key": "b9ab541c-e0c5-4e3f-a6cb-7e9f4deadb80",
    },
  }),
  endpoints: () => ({}),
});

import { RTK_api } from "./baseQuery";

const authAPI = RTK_api.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<AuthUser, void>({
      query: () => `/auth/me`,
      transformResponse: (res: AuthMeType) => {
        return {
          email: res.data.email,
          id: res.data.id,
          login: res.data.login,
        };
      },
      providesTags: ["user_me"],
    }),
    logout: builder.mutation<TransformAuthMeType, void>({
      query: () => {
        return {
          method: "DELETE",
          url: "/auth/login",
        };
      },
      invalidatesTags: ["user_me"],
    }),
    login: builder.mutation<AuthLoginType, LoginParamsType>({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          params: data,
        };
      },
      invalidatesTags: ["user_me"],
    }),
  }),
});

export const { useMeQuery, useLoginMutation, useLogoutMutation } = authAPI;
type TransformAuthMeType = {
  isInitialized: boolean;
};

type AuthUser = {
  id: number;
  email: string;
  login: string;
};
type AuthMeType = {
  data: AuthUser;
  resultCode: number;
  messages: string[];
};
type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

type AuthLoginType = {
  data: {
    userId: number;
  };
  resultCode: number;
  messages: string[];
};

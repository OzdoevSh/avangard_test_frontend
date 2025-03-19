import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tasksApi = createApi({
  reducerPath: 'tasks',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: headers => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: builder => ({
    getTasks: builder.query({
      query: ({ search, page, limit, status = '', deadline = '' }) => (
        `/tasks?search=${search}&page=${page}&limit=${limit}&status=${status}&deadline=${deadline}`
      ),
      providesTags: ['Task'],
    }),

    createTask: builder.mutation({
      query: task => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),

    updateTask: builder.mutation({
      query:  ({id, values}) => ({
          url: `/tasks/${id}`,
          method: 'PUT',
          body: values,
        }
      ),
      invalidatesTags: ['Task'],
    }),

    deleteTask: builder.mutation({
      query: id => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/updateStatus`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} = tasksApi;
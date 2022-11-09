import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: (headers, {}) => {
            const token = getToken()
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('Content-Type', 'application/json')
            headers.set('Accept', 'application/json')
            headers.set('Cache-Control', 'no-cache')
            return headers
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => ({ url: `user/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUserRequest: builder.query({
            query: (id) => ({ url: `user?requests=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUserEnrolled: builder.query({
            query: (id) => ({ url: `user?studentOf=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUsers: builder.query({
            query: () => ({ url: `user` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUserByEmailForCourse: builder.query({
            query: ({id, email}) => ({ url: `user?email=${ email }&studentOf=${ id }` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUserByNicknameForCourse: builder.query({
            query: ({id, nickname}) => ({ url: `user?nickname=${ nickname }&studentOf=${ id }` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getInstructorsOfCourse: builder.query({
            query: (id) => ({ url: `user?instructorOf=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
        }),
        getUserStudentOf: builder.query({
            query: (id) => ({ url: `user/${id}?_join=studentOf` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `user/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['User'],
        }),
    }),
})

export const { 
    useGetUserQuery, 
    useGetUserRequestQuery,
    useGetUserEnrolledQuery,
    useGetUserByEmailForCourseQuery,
    useGetUserByNicknameForCourseQuery,
    useGetUsersQuery, 
    useGetInstructorsOfCourseQuery,
    useGetUserStudentOfQuery, 
    useUpdateUserMutation
} = userApi
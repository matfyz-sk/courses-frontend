import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const userApi = createApi({
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
    tagTypes: ['User', 'Courses'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => ({ url: `user/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['User'],
        }),
        getUsers: builder.query({
            query: () => ({ url: `user` }),
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
        getUsersCourses: builder.query({
            query: (id) => ({ url: `courseInstance?hasInstructor=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Courses'],
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
    useGetUsersQuery, 
    useGetInstructorsOfCourseQuery,
    useGetUserStudentOfQuery, 
    useGetUsersCoursesQuery, 
    useUpdateUserMutation
} = userApi
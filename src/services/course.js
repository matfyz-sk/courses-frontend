import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const courseApi = createApi({
    reducerPath: 'courseApi',
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
    tagTypes: ['Course'],
    endpoints: (builder) => ({
        getCourseWithInstructor: builder.query({
            query: (id) => ({ url: `courseInstance?hasInstructor=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        getPlainCourse: builder.query({
            query: (id) => ({ url: `course/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        getCourse: builder.query({
            query: (id) => ({ url: `course/${id}?_join=hasPrerequisite,hasAdmin` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        getCourses: builder.query({
            query: () => ({ url: `course` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        getCourseInstance: builder.query({
            query: (id) => ({ url: `courseInstance/${id}?_join=instanceOf,covers,hasInstructor` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        getCourseInstances: builder.query({
            query: () => ({ url: `courseInstance?_join=instanceOf` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Course'],
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({ 
                url: `course/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        deleteCourseInstance: builder.mutation({
            query: (id) => ({ 
                url: `courseInstance/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        updateCourseInstance: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `courseInstance/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        updateCourse: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `course/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        newCourseInstance: builder.mutation({
            query: (body) => ({ 
                url: `courseInstance`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        newCoursePersonalSettings: builder.mutation({
            query: (body) => ({ 
                url: `coursePersonalSettings`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
        newCourse: builder.mutation({
            query: (body) => ({ 
                url: `course`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Course'],
        }),
    }),
})

export const { 
    useGetCourseWithInstructorQuery,
    useGetCourseQuery,
    useGetCoursesQuery,
    useGetPlainCourseQuery,
    useGetCourseInstanceQuery,
    useGetCourseInstancesQuery,
    useDeleteCourseMutation,
    useDeleteCourseInstanceMutation,
    useUpdateCourseInstanceMutation,
    useUpdateCourseMutation,
    useNewCourseInstanceMutation,
    useNewCoursePersonalSettingsMutation,
    useNewCourseMutation,
} = courseApi
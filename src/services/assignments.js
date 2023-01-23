import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const assignmentApi = createApi({
    reducerPath: 'assignmentApi',
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
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({
        getAssignment: builder.query({
            query: (id) => ({ url: `assignment/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getAssignmentByCourseInstance: builder.query({
            query: (id) => ({ url: `assignment?courseInstance=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getAssignmentPeriod: builder.query({
            query: (id) => ({ url: `assignmentPeriod/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getSubmissionForAssignment: builder.query({
            query: (id) => ({ url: `submission?ofAssignment=${id}&_join=submittedByStudent,submittedByTeam` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({ 
                url: `assignment/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignmentPeriod: builder.mutation({
            query: (id) => ({ 
                url: `assignmentPeriod/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Assignment'],
        }),
        addSubmissionToReview: builder.mutation({
            query: (post) => ({ 
                url: `toReview`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Assignment'],
        }),
        updateAssignment: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `assignment/${id})`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Assignment'],
        }),
    }),
})

export const { 
    useGetAssignmentQuery,
    useGetAssignmentByCourseInstanceQuery,
    useGetAssignmentPeriodQuery,
    useGetSubmissionForAssignmentQuery,
    useDeleteAssignmentMutation,
    useDeleteAssignmentPeriodMutation,
    useAddSubmissionToReviewMutation,
    useUpdateAssignmentMutation,
} = assignmentApi
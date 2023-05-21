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
        getAssignmentHasField: builder.query({
            query: (id) => ({ url: `assignment/${id}?_join=hasField` }),
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
        getSubmissionSubmitedByStudent: builder.query({
            query: ({id, studentId, attr}) => ({ url: `submission?ofAssignment=${id}&submittedByStudent=${studentId}${attr}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getSubmissionSubmitedByTeam: builder.query({
            query: ({id, teamId, attr}) => ({ url: `submission?ofAssignment=${id}&submittedByTeam=${teamId}${attr}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getSubmittedField: builder.query({
            query: (id) => ({ url: `submittedField/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getField: builder.query({
            query: (id) => ({ url: `field/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({ 
                url: `assignment/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignmentPeriod: builder.mutation({
            query: (id) => ({ 
                url: `assignmentPeriod/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignmentPeerReviewPeriod: builder.mutation({
            query: (id) => ({ 
                url: `assignment/${id}/peerReviewPeriod`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        deleteField: builder.mutation({
            query: (id) => ({ 
                url: `field/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        addSubmittedField: builder.mutation({
            query: (post) => ({ 
                url: `submittedField`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        addSubmission: builder.mutation({
            query: (post) => ({ 
                url: `submission`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        addAssignmentPeriod: builder.mutation({
            query: (post) => ({ 
                url: `assignmentPeriod`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        addField: builder.mutation({
            query: (post) => ({ 
                url: `field`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        addAssignment: builder.mutation({
            query: (post) => ({ 
                url: `assignment`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        updateAssignment: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `assignment/${id})`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        updateSubmittedField: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `submittedField/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        updateSubmission: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `submission/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        updateAssignmentPeriod: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `assignmentPeriod/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
        updateField: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `field/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        }),
    }),
})

export const { 
    useGetAssignmentQuery,
    useLazyGetAssignmentQuery,
    useGetAssignmentByCourseInstanceQuery,
    useLazyGetAssignmentByCourseInstanceQuery,
    useGetAssignmentHasFieldQuery,
    useGetAssignmentPeriodQuery,
    useLazyGetAssignmentPeriodQuery,
    useGetSubmissionForAssignmentQuery,
    useLazyGetSubmissionForAssignmentQuery,
    useGetSubmissionSubmitedByStudentQuery,
    useGetSubmissionSubmitedByTeamQuery,
    useGetSubmittedFieldQuery,
    useGetFieldQuery,
    useDeleteAssignmentMutation,
    useDeleteAssignmentPeriodMutation,
    useDeleteAssignmentPeerReviewPeriodMutation,
    useDeleteFieldMutation,
    useAddSubmittedFieldMutation,
    useAddSubmissionMutation,
    useAddAssignmentPeriodMutation,
    useAddFieldMutation,
    useAddAssignmentMutation,
    useUpdateAssignmentMutation,
    useUpdateSubmittedFieldMutation,
    useUpdateSubmissionMutation,
    useUpdateAssignmentPeriodMutation,
    useUpdateFieldMutation,
} = assignmentApi
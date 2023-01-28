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
        getSubmissionSubmitedByStudent: builder.query({
            query: ({id, studentId}) => ({ url: `submission?ofAssignment=${id}&submittedByStudent=${studentId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getSubmissionSubmitedByTeam: builder.query({
            query: ({id, teamId}) => ({ url: `submission?ofAssignment=${id}&submittedByTeam=${teamId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getToReviewForStudent: builder.query({
            query: (id) => ({ url: `toReview?student=${id}&_join=submission` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getToReviewForTeam: builder.query({
            query: (id) => ({ url: `toReview?team=${id}&_join=submission` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getPeerReview: builder.query({
            query: (id) => ({ url: `peerReview` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getPeerReviewForTeam: builder.query({
            query: ({teamId, id}) => ({ url: `peerReview?reviewedByTeam=${teamId}&ofSubmission=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getTeamReviewOfUserAndSubmission: builder.query({
            query: ({id, subId}) => ({ url: `teamReview?reviewedStudent=${id}&ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getTeamReviewOfSubmissionCreatedBy: builder.query({
            query: ({id, subId}) => ({ url: `teamReview?ofSubmission=${subId}&createdBy=${id}&&_join=reviewedStudent` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getTeamReviewOfSubmission: builder.query({
            query: (subId) => ({ url: `teamReview?ofSubmission=${subId}` }),
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
        addSubmittedField: builder.mutation({
            query: (post) => ({ 
                url: `submittedField`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Assignment'],
        }),
        addSubmission: builder.mutation({
            query: (post) => ({ 
                url: `submission`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Assignment'],
        }),
        addTeamReview: builder.mutation({
            query: (post) => ({ 
                url: `teamReview`,
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
        updateSubmittedField: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `submittedField/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Assignment'],
        }),
        updateSubmission: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `submission/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Assignment'],
        }),
        updateTeamReview: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `teamReview/${id}`,
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
    useGetSubmissionSubmitedByStudentQuery,
    useGetSubmissionSubmitedByTeamQuery,
    useGetToReviewForStudentQuery,
    useGetToReviewForTeamQuery,
    useGetPeerReviewQuery,
    useGetPeerReviewForTeamQuery,
    useGetTeamReviewOfUserAndSubmissionQuery,
    useGetTeamReviewOfSubmissionCreatedByQuery,
    useGetTeamReviewOfSubmissionQuery,
    useDeleteAssignmentMutation,
    useDeleteAssignmentPeriodMutation,
    useAddSubmissionToReviewMutation,
    useAddSubmittedFieldMutation,
    useAddSubmissionMutation,
    useAddTeamReviewMutation,
    useUpdateAssignmentMutation,
    useUpdateSubmittedFieldMutation,
    useUpdateSubmissionMutation,
    useUpdateTeamReviewMutation,
} = assignmentApi
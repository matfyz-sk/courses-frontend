import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { FiAlertTriangle } from 'react-icons/fi';
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
        getToReview: builder.query({
            query: (id) => ({ url: `toReview/${id}?_join=submission` }),
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
        getPeerReviewAnswersOfSubmission: builder.query({
            query: (id) => ({ url: `peerReview?ofSubmission=${id}&_join=hasQuestionAnswer,createdBy` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getTeamReviewOfUserAndSubmission: builder.query({
            query: ({id, subId}) => ({ url: `teamReview?reviewedStudent=${id}&ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getPeerReviewForTeamHasAnswer: builder.query({
            query: ({teamId, id}) => ({ url: `peerReview?reviewedByTeam=${teamId}&ofSubmission=${id}&_join=hasQuestionAnswer` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getPeerReviewOfUserHasAnswer: builder.query({
            query: ({id, subId}) => ({ url: `peerReview?reviewedByStudent=${id}&ofSubmission=${subId}&_join=hasQuestionAnswer` }),
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
        getCommentOfSubmissionCreatedBy: builder.query({
            query: (subId) => ({ url: `comment?ofSubmission=${subId}&_join=createdBy` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getCommentOfSubmission: builder.query({
            query: (subId) => ({ url: `comment?ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Assignment'],
        }),
        getPeerReviewQuestion: builder.query({
            query: (id) => ({ url: `peerReviewQuestion/${id}` }),
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
        addComment: builder.mutation({
            query: (post) => ({ 
                url: `comment`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Assignment'],
        }),
        addPeerReview: builder.mutation({
            query: (post) => ({ 
                url: `peerReview`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Assignment'],
        }),
        addPeerReviewQuestionAnswer: builder.mutation({
            query: (post) => ({ 
                url: `peerReviewQuestionAnswer`,
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
        updatePeerReview: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `peerReview/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Assignment'],
        }),
        updatePeerReviewQuestionAnswer: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `peerReviewQuestionAnswer/${id}`,
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
    useGetAssignmentHasFieldQuery,
    useGetAssignmentPeriodQuery,
    useGetSubmissionForAssignmentQuery,
    useGetSubmissionSubmitedByStudentQuery,
    useGetSubmissionSubmitedByTeamQuery,
    useGetSubmittedFieldQuery,
    useGetToReviewQuery,
    useGetToReviewForStudentQuery,
    useGetToReviewForTeamQuery,
    useGetPeerReviewQuery,
    useGetPeerReviewForTeamQuery,
    useGetPeerReviewAnswersOfSubmissionQuery,
    useGetTeamReviewOfUserAndSubmissionQuery,
    useGetTeamReviewOfSubmissionCreatedByQuery,
    useGetTeamReviewOfSubmissionQuery,
    useGetCommentOfSubmissionCreatedByQuery,
    useGetCommentOfSubmissionQuery,
    useGetPeerReviewQuestionQuery,
    useGetPeerReviewForTeamHasAnswerQuery,
    useGetPeerReviewOfUserHasAnswerQuery,
    useDeleteAssignmentMutation,
    useDeleteAssignmentPeriodMutation,
    useAddSubmissionToReviewMutation,
    useAddSubmittedFieldMutation,
    useAddSubmissionMutation,
    useAddTeamReviewMutation,
    useAddCommentMutation,
    useAddPeerReviewMutation,
    useAddPeerReviewQuestionAnswerMutation,
    useUpdateAssignmentMutation,
    useUpdateSubmittedFieldMutation,
    useUpdateSubmissionMutation,
    useUpdateTeamReviewMutation,
    useUpdatePeerReviewMutation,
    useUpdatePeerReviewQuestionAnswerMutation,
} = assignmentApi
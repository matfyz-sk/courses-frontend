import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const peerReviewApi = createApi({
    reducerPath: 'peerReviewApi',
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
    tagTypes: ['PeerReview'],
    endpoints: (builder) => ({
        getPeerReview: builder.query({
            query: (id) => ({ url: `peerReview` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewForTeam: builder.query({
            query: ({teamId, id}) => ({ url: `peerReview?reviewedByTeam=${teamId}&ofSubmission=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewAnswersOfSubmission: builder.query({
            query: (id) => ({ url: `peerReview?ofSubmission=${id}&_join=hasQuestionAnswer,createdBy` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewForTeamHasAnswer: builder.query({
            query: ({teamId, id}) => ({ url: `peerReview?reviewedByTeam=${teamId}&ofSubmission=${id}&_join=hasQuestionAnswer` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewOfUserHasAnswer: builder.query({
            query: ({id, subId}) => ({ url: `peerReview?reviewedByStudent=${id}&ofSubmission=${subId}&_join=hasQuestionAnswer` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getCommentOfSubmissionCreatedBy: builder.query({
            query: (subId) => ({ url: `comment?ofSubmission=${subId}&_join=createdBy` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getCommentOfSubmission: builder.query({
            query: (subId) => ({ url: `comment?ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewQuestion: builder.query({
            query: (id) => ({ url: `peerReviewQuestion/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        getPeerReviewQuestions: builder.query({
            query: (id) => ({ url: `PeerReviewQuestion` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['PeerReview'],
        }),
        addComment: builder.mutation({
            query: (post) => ({ 
                url: `comment`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        addCodeComment: builder.mutation({
            query: (post) => ({ 
                url: `codeComment`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        addPeerReview: builder.mutation({
            query: (post) => ({ 
                url: `peerReview`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        addPeerReviewQuestion: builder.mutation({
            query: (post) => ({ 
                url: `PeerReviewQuestion`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        addPeerReviewQuestionAnswer: builder.mutation({
            query: (post) => ({ 
                url: `peerReviewQuestionAnswer`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        updatePeerReview: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `peerReview/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
        updatePeerReviewQuestionAnswer: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `peerReviewQuestionAnswer/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['PeerReview'],
        }),
    }),
})

export const { 
    useGetPeerReviewQuery,
    useGetPeerReviewForTeamQuery,
    useGetPeerReviewAnswersOfSubmissionQuery,
    useGetCommentOfSubmissionCreatedByQuery,
    useGetCommentOfSubmissionQuery,
    useGetPeerReviewQuestionQuery,
    useGetPeerReviewQuestionsQuery,
    useGetPeerReviewForTeamHasAnswerQuery,
    useGetPeerReviewOfUserHasAnswerQuery,
    useAddCommentMutation,
    useAddCodeCommentMutation,
    useAddPeerReviewMutation,
    useAddPeerReviewQuestionMutation,
    useAddPeerReviewQuestionAnswerMutation,
    useUpdatePeerReviewMutation,
    useUpdatePeerReviewQuestionAnswerMutation,
} = peerReviewApi
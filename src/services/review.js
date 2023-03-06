import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
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
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getToReview: builder.query({
            query: (id) => ({ url: `toReview/${id}?_join=submission` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        getToReviewForStudent: builder.query({
            query: (id) => ({ url: `toReview?student=${id}&_join=submission` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        getToReviewForTeam: builder.query({
            query: (id) => ({ url: `toReview?team=${id}&_join=submission` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        getTeamReviewOfUserAndSubmission: builder.query({
            query: ({id, subId}) => ({ url: `teamReview?reviewedStudent=${id}&ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        getTeamReviewOfSubmissionCreatedBy: builder.query({
            query: ({id, subId}) => ({ url: `teamReview?ofSubmission=${subId}&createdBy=${id}&&_join=reviewedStudent` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        getTeamReviewOfSubmission: builder.query({
            query: (subId) => ({ url: `teamReview?ofSubmission=${subId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Review'],
        }),
        addSubmissionToReview: builder.mutation({
            query: (post) => ({ 
                url: `toReview`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Review'],
        }),
        addTeamReview: builder.mutation({
            query: (post) => ({ 
                url: `teamReview`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Review'],
        }),
        updateTeamReview: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `teamReview/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Review'],
        }),
    }),
})

export const { 
    useGetToReviewQuery,
    useGetToReviewForStudentQuery,
    useGetToReviewForTeamQuery,
    useGetTeamReviewOfUserAndSubmissionQuery,
    useGetTeamReviewOfSubmissionCreatedByQuery,
    useGetTeamReviewOfSubmissionQuery,
    useAddSubmissionToReviewMutation,
    useAddTeamReviewMutation,
    useUpdateTeamReviewMutation,
} = reviewApi
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
        deleteAssignmentPeerReviewPeriod: builder.mutation({ //ZAMYSLIET SA
            query: (id) => ({ 
                url: `assignment/${id}/peerReviewPeriod`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Assignment'],
        })
    }),
})

export const { 
    useDeleteAssignmentPeerReviewPeriodMutation,
} = assignmentApi
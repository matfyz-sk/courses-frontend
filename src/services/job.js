import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../constants";

export const jobApi = createApi({
    reducerPath: 'jobApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BACKEND_URL,
        prepareHeaders: (headers, {}) => {
            headers.set('Content-Type', 'application/json')
            headers.set('Accept', 'application/json')
            headers.set('Cache-Control', 'no-cache')
            return headers
        },
    }),
    tagTypes: ['Job'],
    endpoints: (builder) => ({
        scheduleJob: builder.mutation({
            query: (body) => ({ 
                url: `jobs/schedule`,
                method: 'POST',
                body: body, // courseInstance, id, badgeId, enableDate, disableDate, users, awardableTo, additional, color
            }),
            transformResponse: (response, meta, arg) => response,
        }),
        cancelJob: builder.mutation({
            query: (body) => ({ 
                url: `jobs/cancel`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response,
        }),
    }),
})

export const { 
    useScheduleJobMutation,
    useCancelJobMutation,
} = jobApi
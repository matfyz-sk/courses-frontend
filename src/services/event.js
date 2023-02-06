import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const eventApi = createApi({
    reducerPath: 'eventApi',
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
    tagTypes: ['Event'],
    endpoints: (builder) => ({
        getCourseInstanceEvent: builder.query({
            query: (id) => ({ url: `event?courseInstance=${id}&_join=uses,recommends,documentReference` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Event'],
        }),
        getCourseInstanceEventDocRef: builder.query({
            query: (id) => ({ url: `event?courseInstance=${id}&_join=documentReference` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Event'],
        }),
        getTimelineEvent: builder.query({
            query: (id) => ({ url: `event?courseInstance=${id}&_join=courseInstance,documentReference` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Event'],
        }),
        getEvent: builder.query({
            query: (id) => ({ url: `event/${id}?_join=hasInstructor,uses,recommends,documentReference` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Event'],
        }),
        getEventCourseInstance: builder.query({
            query: (id) => ({ url: `event/${id}?_join=courseInstance,uses,recommends,documentReference` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Event'],
        }),
        newEvent: builder.mutation({
            query: (body) => ({ 
                url: `event`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
        newTimelineBlock: builder.mutation({
            query: (body) => ({ 
                url: `block`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
        updateEventByType: builder.mutation({
            query: ({id, type, patch}) => ({ 
                url: `${type}/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
        deleteEventByType: builder.mutation({
            query: ({id, type}) => ({ 
                url: `${type}/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
    }),
})

export const { 
    useGetCourseInstanceEventQuery,
    useGetCourseInstanceEventDocRefQuery,
    useGetTimelineEventQuery,
    useGetEventQuery,
    useGetEventCourseInstanceQuery,
    useNewEventMutation,
    useNewTimelineBlockMutation,
    useUpdateEventByTypeMutation,
    useDeleteEventByTypeMutation,
} = eventApi
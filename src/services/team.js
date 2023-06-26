import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const teamApi = createApi({
    reducerPath: 'teamApi',
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
    tagTypes: ['Team'],
    endpoints: (builder) => ({
        getTeamInstanceWithUsers: builder.query({
            query: (id) => ({ url: `teamInstance?instanceOf=${id}&_join=hasUser` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getTeamWithCourseInstance: builder.query({
            query: (id) => ({ url: `team?courseInstance=${id}&_orderBy=name` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getTeamInstanceWithApprovedUsers: builder.query({
            query: (id) => ({ url: `teamInstance?instanceOf=${id}&approved=true&_join=hasUser` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
    }),
})

export const {
    useGetTeamInstanceWithUsersQuery,
    useGetTeamWithCourseInstanceQuery,
    useGetTeamInstanceWithApprovedUsersQuery,
} = teamApi
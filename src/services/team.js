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
        getTeamForCourseOrderedByName: builder.query({
            query: (id) => ({ url: `team?courseInstance=${id}&_orderBy=name` }),
            transformResponse: (response, meta, arg) => response,
            providesTags: ['Team'],
        }),
        getTeam: builder.query({
            query: (id) => ({ url: `team/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getTeamInstanceWithUsers: builder.query({
            query: (id) => ({ url: `teamInstance?instanceOf=${id}&_join=hasUser` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getTeamInstanceWithApprovedUsers: builder.query({
            query: (id) => ({ url: `teamInstance?instanceOf=${id}&approved=true&_join=hasUser` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getUsersTeam: builder.query({
            query: (id) => ({ url: `teamInstance?hasUser=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getTeamDetails: builder.query({
            query: (id) => ({ url: `team/${id}?_join=courseInstance` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        newTeamInstance: builder.mutation({
            query: (post) => ({ 
                url: `teamInstance`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Team'],
        }),
        newTeam: builder.mutation({
            query: (post) => ({ 
                url: `team`,
                method: 'POST',
                body: post,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Team'],
        }),
        updateTeamInstance: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `teamInstance/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Team'],
        }),
        removeTeam: builder.mutation({
            query: (id) => ({ 
                url: `team/${id}`,
                method: 'PATCH',
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Team'],
        }),
        removeTeamInstance: builder.mutation({
            query: (id) => ({ 
                url: `teamInstance/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Team'],
        }),
    }),
})

export const { 
    useGetTeamForCourseOrderedByNameQuery,
    useGetTeamQuery,
    useGetTeamInstanceWithUsersQuery,
    useGetTeamInstanceWithApprovedUsersQuery,
    useGetUsersTeamQuery,
    useGetTeamDetailsQuery,
    useNewTeamInstanceMutation,
    useNewTeamMutation,
    useUpdateTeamInstanceMutation,
    useRemoveTeamInstanceMutation,
    useRemoveTeamMutation,
} = teamApi
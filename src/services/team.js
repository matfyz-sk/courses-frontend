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
        getUsersTeam: builder.query({
            query: (id) => ({ url: `teamInstance?hasUser=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
        getUsersTeam: builder.query({
            query: (id) => ({ url: `teamInstance?hasUser=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Team'],
        }),
    }),
})

export const { 
    useGetUsersTeamQuery
} = teamApi
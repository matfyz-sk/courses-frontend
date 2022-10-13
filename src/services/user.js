import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const userApi = createApi({
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
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (id) => ({ url: `user/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"][0],
        }),
        updateUser: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `user/${id}`,
                method: 'PATCH',
                body: patch,
            }),
        }),
    }),
})

export const { useGetUserQuery,  useUpdateUserMutation} = userApi
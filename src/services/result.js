import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const resultApi = createApi({
    reducerPath: 'resultApi',
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
    tagTypes: ['Result'],
    endpoints: (builder) => ({
        getResultForUser: builder.query({
            query: (id) => ({ url: `result?hasUser=${id}&_join=courseInstance,awardedBy,type` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
    }),
})

export const { 
    useGetResultForUserQuery
} = resultApi
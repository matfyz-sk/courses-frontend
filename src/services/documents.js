import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const documentsApi = createApi({
    reducerPath: 'documentsApi',
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
    tagTypes: ['Documents'],
    endpoints: (builder) => ({
        getMaterials: builder.query({
            query: () => ({ url: `material` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Documents'],
        }),
        getMaterial: builder.query({
            query: (id) => ({ url: `material/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Documents'],
        }),
        newFolder: builder.mutation({
            query: (body) => ({ 
                url: `folder`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Documents'],
        }),
    }),
})

export const { 
    useGetMaterialsQuery,
    useGetMaterialQuery,
    useNewFolderMutation,
} = documentsApi
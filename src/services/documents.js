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
        getFile: builder.query({
            query: (id) => ({ url: `file/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Documents'],
        }),
        addMaterial: builder.mutation({
            query: (body) => ({ 
                url: `material`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Documents'],
        }),
        newFolder: builder.mutation({
            query: (body) => ({ 
                url: `folder`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Documents'],
        }),
        addFile: builder.mutation({
            query: (body) => ({
                url: `file`,
                method: 'POST',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response.resource.iri,
            invalidatesTags: ['Documents'],
        }),
        updateFile: builder.mutation({
            query: ({ id, body }) => ({
                url: `file/${id}`,
                method: 'PATCH',
                body: body,
            }),
            transformResponse: (response, meta, arg) => response.resource.iri,
            invalidatesTags: ['Documents'],
        }),
        getFolderParentChain: builder.query({
          query: (id) => ({ url: `folder/${id}?_chain=parent&_join=parent` }),
          transformResponse: (response, meta, arg) => response["@graph"] ?? [],
          providesTags: ['Documents'],
        }),
        getDocumentHistory: builder.query({
            query: (id) => ({ url: `document/${id}?_chain=previousVersion` }),
            transformResponse: (response, meta, arg) => response["@graph"] ?? [],
            providesTags: ['Documents'],
        })
    }),
})

export const { 
    useGetMaterialsQuery,
    useGetMaterialQuery,
    useAddMaterialMutation,
    useGetFileQuery,
    useNewFolderMutation,
    useAddFileMutation,
    useUpdateFileMutation,
    useGetFolderParentChainQuery,
    useGetDocumentHistoryQuery
} = documentsApi
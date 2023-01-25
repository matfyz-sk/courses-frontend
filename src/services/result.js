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
        getAllUserResults: builder.query({
            query: (id) => ({ url: `result?hasUser=${id}&_join=awardedBy,type` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getUserResultsByType: builder.query({
            query: ({id, typeId}) => ({ url: `result?hasUser=${id}&type=${typeId}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultThatHasUser: builder.query({
            query: (id) => ({ url: `result/${id}?_join=hasUser,awardedBy,type` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultByType: builder.query({
            query: (id) => ({ url: `result?type=${id}&_join=hasUser,awardedBy` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultForCourseInstance: builder.query({
            query: (id) => ({ url: `result?courseInstance=${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultTypeDetail: builder.query({
            query: (id) => ({ url: `resultType/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultTypeDetailWithCorrection: builder.query({
            query: (id) => ({ url: `resultType/${id}?_join=correctionFor` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getResultTypeDetailCreatedByWithCorrection: builder.query({
            query: (id) => ({ url: `resultType/${id}?_join=createdBy,correctionFor` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        getCourseGrading: builder.query({
            query: (id) => ({ url: `courseGrading/${id}` }),
            transformResponse: (response, meta, arg) => response["@graph"],
            providesTags: ['Result'],
        }),
        newUserResult: builder.mutation({
            query: (post) => ({ 
                url: `result`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Result'],
        }),
        newResultType: builder.mutation({
            query: (post) => ({ 
                url: `resultType`,
                method: 'POST',
                body: post,
            }),
            invalidatesTags: ['Result'],
        }),
        updateUserResult: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `result/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Result'],
        }),
        updateResultType: builder.mutation({
            query: ({id, patch}) => ({ 
                url: `resultType/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Result'],
        }),
        deleteUserResult: builder.mutation({
            query: (id) => ({ 
                url: `result/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Result'],
        }),
        newCourseGrading: builder.mutation({
            query: (body) => ({ 
                url: `courseGrading`,
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['Result'],
        }),
        deleteCourseGrading: builder.mutation({
            query: (id) => ({ 
                url: `courseGrading/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Result'],
        }),
        deleteResultType: builder.mutation({
            query: (id) => ({ 
                url: `resultType/${id}`,
                method: 'DELETE', 
            }),
            transformResponse: (response, meta, arg) => response["@graph"],
            invalidatesTags: ['Result'],
        }),
    }),
})

export const { 
    useGetResultForUserQuery,
    useGetAllUserResultsQuery,
    useGetUserResultsByTypeQuery,
    useGetResultThatHasUserQuery,
    useGetResultByTypeQuery,
    useGetResultForCourseInstanceQuery,
    useGetResultTypeDetailQuery,
    useGetResultTypeDetailWithCorrectionQuery,
    useGetResultTypeDetailCreatedByWithCorrectionQuery,
    useGetCourseGradingQuery,
    useNewUserResultMutation,
    useNewResultTypeMutation,
    useUpdateUserResultMutation,
    useUpdateResultTypeMutation,
    useDeleteUserResultMutation,
    useNewCourseGradingMutation,
    useDeleteCourseGradingMutation,
    useDeleteResultTypeMutation,
} = resultApi
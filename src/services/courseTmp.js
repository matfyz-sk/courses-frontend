import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from 'components/Auth'
import { API_URL } from "../constants";

export const courseTmpApi = createApi({
    reducerPath: 'courseTmpApi',
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
    tagTypes: ['Course'],
    endpoints: (builder) => ({
      newCourseInstance: builder.mutation({
        query: (body) => ({ 
            url: `courseInstance`,
            method: 'POST',
            body: body,
        }),
        transformResponse: (response, meta, arg) => response,
        invalidatesTags: ['Course'],
      }),   
    })
})

export const { 
    useNewCourseInstanceMutation,
} = courseTmpApi
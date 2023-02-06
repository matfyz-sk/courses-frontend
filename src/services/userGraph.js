import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../constants";
import { gql } from 'graphql-request'
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query"
import { getToken } from 'components/Auth'

export const userGraphApi = createApi({
    reducerPath: 'userGraphApi',
    baseQuery: graphqlRequestBaseQuery({
      url: `http://localhost:3010/graphql`,
    }),
    prepareHeaders: (headers, {}) => {
      headers.set('Content-Type', 'application/json')
      headers.set('Accept', 'application/json')
      return headers
    },
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
              document: gql`
                query {
                  courses_User {
                      courses_email
                      courses_lastName
                  }
                }
              `,
            }),
            transformResponse: (response) => response["@graph"],
            providesTags: ['User'],
        }),
    }),
})

export const { 
    useGetUsersQuery,
} = userGraphApi
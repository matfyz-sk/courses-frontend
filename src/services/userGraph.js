import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../constants";
import { request, gql, ClientError, GraphQLClient } from 'graphql-request'
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query"

const graphqlBaseQuery =
  ({ url }) =>
  async ({ document }) => {
    try {
      const result = await request(url, document)
      return { data: result }
    } catch (error) {
      if (error instanceof ClientError) {
        return { error: { status: error.response.status, message: error } }
      }
      return { error: { status: 500, data: error } }
    }
  }

export const userGraphApi = createApi({
    reducerPath: 'userGraphApi',
    baseQuery: graphqlBaseQuery({
      url: `http://localhost:3010/graphql`,
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
              document: gql`
                query {
                  courses_User {
                    courses_firstName
                    courses_lastName
                    courses_useNickName
                    courses_nickname
                    courses_avatar
                    courses_publicProfile
                    courses_allowContact
                    courses_showCourses
                    courses_showBadges
                    courses_isSuperAdmin
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response) => response,
            providesTags: ['User'],
        }),
    }),
})

export const { 
    useGetUsersQuery,
} = userGraphApi
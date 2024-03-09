import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../constants";
import { gql } from 'graphql-request'
import {
    graphqlBaseQuery,
    getNonStringEquals,
    getOrderBy,
    getSelectById,
    getStringEquals,
    getArrayFormat
} from './baseQuery';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
      getUser: builder.query({
        query: ({id, order, email, nickname, studentOfId, instructorOfId, requestId}) => ({
          document: gql`
            query {
              courses_User${id ? getSelectById(id) : ""} {
                _id
                courses_createdAt${order ? getOrderBy() : ""}
                courses_firstName
                courses_publicProfile
                courses_avatar
                courses_lastName
                courses_showCourses
                courses_allowContact 
                courses_isSuperAdmin
                courses_githubId
                courses_useNickName
                courses_nickname${nickname ? getStringEquals(nickname) : ""}
                courses_description
                courses_email${email ? getStringEquals(email) : ""}
                courses_nickNameTeamException
                courses_showBadges
                courses_studentOf${studentOfId ? getSelectById(studentOfId) : ""} {
                  _id
                  courses_name
                }
                courses_instructorOf${instructorOfId ? getSelectById(instructorOfId) : ""} {
                  _id
                }
                courses_understands {
                  _id
                }
                courses_memberOf {
                  _id
                }
                courses_requests${requestId ? getSelectById(requestId) : ""} {
                  _id
                }
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.User,
        providesTags: ['User'],
      }),  
      getUserTeamInstanceAndTeam: builder.query({
        query: (id) => ({
          document: gql`
            query {
              courses_User(_id: "${id}") {
                courses_memberOf {
                  _id
                  courses_approved
                  courses_team {
                    ... on courses_Team {
                      _id
                      courses_name
                      courses_courseInstance {
                        _id
                        courses_name
                      }
                    }
                  }
                }
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.User,
        providesTags: ['User'],
      }),
      updateUserInfo: builder.mutation({
        query: ({id, body}) => ({ 
          document: gql`
            mutation {
              update_courses_User(
                _id: "${id}"
                ${body.firstName ? `courses_firstName: "${body.firstName}"` : ""}
                ${body.lastName ? `courses_lastName: "${body.lastName}"` : ""}
                ${body.description ? `courses_description: "${body.description}"` : ""}
                ${body.email ? `courses_email: "${body.email}"` : ""}
                ${body.nickname ? `courses_nickname: "${body.nickname}"` : ""}
                ${body.useNickName ? `courses_useNickName: ${body.useNickName}` : ""}
                ${body.nickNameTeamException ? `courses_nickNameTeamException: ${body.nickNameTeamException}` : ""}
                ${body.allowContact ? `courses_allowContact: ${body.allowContact}` : ""}
                ${body.publicProfile ? `courses_publicProfile: ${body.publicProfile}` : ""}
                ${body.showBadges ? `courses_showBadges: ${body.showBadges}` : ""}
                ${body.showCourses ? `courses_showCourses: ${body.showCourses}` : ""}
                ${body.studentOf ? `courses_studentOf: ${getArrayFormat(body.studentOf)}` : ""}
                ${body.memberOf ? `courses_memberOf: ${getArrayFormat(body.memberOf)}` : ""}
                ${body.requests ? `courses_requests: ${getArrayFormat(body.requests)}` : ""}
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.User,
        invalidatesTags: ['User'],
      }),
      deleteUser: builder.mutation({
        query: (id) => ({ 
          document: gql`
            mutation {
              delete_courses_User(
                _id: "${id}"
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.data,
        invalidatesTags: ['User'],
      }),
    }),
})

export const { 
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetUserTeamInstanceAndTeamQuery,
    useUpdateUserInfoMutation,
    useDeleteUserMutation,
} = userApi
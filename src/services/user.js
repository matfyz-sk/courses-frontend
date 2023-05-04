import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from "../constants";
import { gql } from 'graphql-request'
import { 
  graphqlBaseQuery, 
  getNonStringEquals, 
  getOrderBy, 
  getSelectById, 
  getStringEquals 
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
                  courses_instanceOf {
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
                courses_firstName: "${body.firstName}"
                courses_lastName: "${body.lastName}"
                courses_description: "${body.description}"
                courses_email: "${body.email}"
                courses_nickname: "${body.nickname}"
                courses_useNickName: ${body.useNickName}
                courses_nickNameTeamException: ${body.nickNameTeamException}
                courses_allowContact: ${body.allowContact}
                courses_publicProfile: ${body.publicProfile}
                courses_showBadges:  ${body.showBadges}
                courses_showCourses: ${body.showCourses}
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
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

export const teamGraphApi = createApi({
    reducerPath: 'teamGraphApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['Team'],
    endpoints: (builder) => ({
        getTeam: builder.query({
            query: ({id, order, courseInstanceId}) => ({
              document: gql`
                query {
                    courses_Team${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_avatar
                        courses_name${order ? getOrderBy() : ""}
                        courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                            _id
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Team,
            providesTags: ['Team'],
        }),
        getTeamInstance: builder.query({
            query: ({id, userId, instanceOf}) => ({
              document: gql`
                query {
                    courses_TeamInstance${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_approved
                        courses_requestFrom {
                            _id
                        }
                        courses_hasUser${userId ? getSelectById(userId) : ""} {
                            _id
                            courses_showBadges
                            courses_showCourses
                            courses_publicProfile
                            courses_allowContact
                            courses_isSuperAdmin
                            courses_firstName
                            courses_lastName
                            courses_nickNameTeamException
                            courses_nickname
                            courses_useNickName
                        }
                        courses_instanceOf${instanceOf ? getSelectById(instanceOf) : ""} {
                            _id
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.TeamInstance,
            providesTags: ['Team'],
        }),
        newTeam: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_Team(
                        courses_name: "${body.name}"
                        ${body.avatar ? `courses_avatar: "${body.avatar}"` : ""}
                        ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Team,
            invalidatesTags: ['Team'],
        }),
        newTeamInstance: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_TeamInstance(
                        courses_hasUser: "${body.hasUser}"
                        courses_approved: ${body.approved}
                        ${body.requestFrom ? `courses_requestFrom: "${body.requestFrom}"` : ""}
                        courses_instanceOf_as_courses_Team: "${body.instanceOf}"
                        courses_instanceOf_as_courses_Course: ""
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.TeamInstance,
            invalidatesTags: ['Team'],
        }),
        updateTeamInstance: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_TeamInstance(
                        _id: "${id}"
                        ${body.hasUser ? `courses_hasUser: "${body.hasUser}"` : ""}
                        ${body.approved ? `courses_approved: "${body.approved}"` : ""}
                        ${body.requestFrom ? `courses_requestFrom: "${body.requestFrom}"` : ""}
                        ${body.instanceOf ? `courses_instanceOf_as_courses_Team: "${body.instanceOf}"` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.TeamInstance,
            invalidatesTags: ['Team'],
        }),
        deleteTeam: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_Team(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Team,
            invalidatesTags: ['Team'],
        }),
        deleteTeamInstance: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_TeamInstance(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.TeamInstance,
            invalidatesTags: ['Team'],
        }),
    })
})

export const { 
    useGetTeamQuery,
    useLazyGetTeamQuery,
    useGetTeamInstanceQuery,
    useNewTeamMutation,
    useNewTeamInstanceMutation,
    useUpdateTeamInstanceMutation,
    useDeleteTeamMutation,
    useDeleteTeamInstanceMutation,
} = teamGraphApi
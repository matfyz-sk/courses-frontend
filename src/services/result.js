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

export const resultApi = createApi({
    reducerPath: 'resultApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['Result'],
    endpoints: (builder) => ({
        getResult: builder.query({
            query: ({id, typeId, userId, courseInstanceId}) => ({
              document: gql`
                query {
                    courses_Result${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_reference
                        courses_points
                        courses_description
                        courses_awardedBy {
                            _id
                            courses_lastName
                        }
                        courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                            _id
                            courses_name
                        }
                        courses_type${typeId ? getSelectById(typeId) : ""} {
                            _id
                            courses_name
                        }
                        courses_hasUser${userId ? getSelectById(userId) : ""} {
                            _id
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Result,
            providesTags: ['Result'],
        }),
        getResultType: builder.query({
            query: (id) => ({
              document: gql`
                query {
                    courses_ResultType${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_minPoints
                        courses_name
                        courses_description
                        courses_correctionFor {
                            _id
                            courses_name
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.ResultType,
            providesTags: ['Result'],
        }),
        getCourseGrading: builder.query({
            query: (id) => ({
              document: gql`
                query {
                    courses_CourseGrading${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_minPoints
                        courses_grade
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.CourseGrading,
            providesTags: ['Result'],
        }),
        updateResult: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_Result (
                        _id: "${id}"
                        ${body.points ? `courses_points: ${body.points}` : ""}
                        ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.hasUser ? `courses_hasUser: "${body.hasUser}"` : ""}
                        ${body.reference ? `courses_reference: "${body.reference}"` : ""}
                        ${body.type ? `courses_type: "${body.type}"` : ""}
                        ${body.awardedBy ? `courses_awardedBy: "${body.awardedBy}"` : ""}
                    ){
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Result,
            invalidatesTags: ['Result'],
        }),
        updateResultType: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_ResultType (
                        _id: "${id}"
                        ${body.correctionFor ? `courses_correctionFor: "${body.correctionFor}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.name ? `courses_name: "${body.name}"` : ""}
                        ${body.minPoints ? `courses_minPoints: ${body.minPoints}` : ""}
                    ){
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.ResultType,
            invalidatesTags: ['Result'],
        }),
        updateCourseGrading: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_CourseGrading (
                        _id: "${id}"
                        ${body.minPoints ? `courses_minPoints: ${body.minPoints}` : ""}
                        ${body.grade ? `courses_grade: "${body.grade}"` : ""}
                    ){
                        _id
                        courses_minPoints
                        courses_grade
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.CourseGrading,
            invalidatesTags: ['Result'],
        }),
        newResult: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_Result (
                        ${body.points ? `courses_points: ${body.points}` : ""}
                        ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.hasUser ? `courses_hasUser: "${body.hasUser}"` : ""}
                        ${body.reference ? `courses_reference: "${body.reference}"` : ""}
                        ${body.type ? `courses_type: "${body.type}"` : ""}
                        ${body.awardedBy ? `courses_awardedBy: "${body.awardedBy}"` : ""}
                    ){
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Result,
            invalidatesTags: ['Result'],
        }),
        newResultType: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_ResultType (
                        ${body.correctionFor ? `courses_correctionFor: "${body.correctionFor}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.name ? `courses_name: "${body.name}"` : ""}
                        ${body.minPoints ? `courses_minPoints: ${body.minPoints}` : ""}
                    ){
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.ResultType,
            invalidatesTags: ['Result'],
        }),
        newCourseGrading: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_CourseGrading (
                        ${body.minPoints ? `courses_minPoints: ${body.minPoints}` : ""}
                        ${body.grade ? `courses_grade: "${body.grade}"` : ""}
                    ){
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.CourseGrading,
            invalidatesTags: ['Result'],
        }),
        deleteResult: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_Result(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Result,
            invalidatesTags: ['Result'],
        }),
        deleteCourseGrading: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_CourseGrading(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.CourseGrading,
            invalidatesTags: ['Result'],
        }),
        deleteResultType: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_ResultType(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.ResultType,
            invalidatesTags: ['Result'],
        }),
        getCourseHasGrading: builder.query({
          
          query: (id) => ({
            document: gql`
              query {
                  courses_CourseInstance${id ? getSelectById(id) : ""} {
                      _id
                      courses_hasGrading{
                        _id
                        courses_minPoints
                        courses_grade
                      }
                    }
                  }
            `,
          }),
          transformResponse: (response, meta, arg) => response.CourseInstance,
          providesTags: ['Result'],
        }),
        getCourseHasResultType: builder.query({
          
          query: (id) => ({
            document: gql`
              query {
                courses_CourseInstance${id ? getSelectById(id) : ""} {
                    _id
                    courses_hasResultType{
                      _id
                      courses_name
                      courses_minPoints
                      courses_description
                      courses_correctionFor {
                        courses_createdAt
                        courses_minPoints
                        _type
                        courses_name
                      }
                    }
                  }
                }
            `,
          }),
          transformResponse: (response, meta, arg) => response.CourseInstance,
          providesTags: ['Result'],
        }),
        getAllResultTypes: builder.query({
          query: (id) => ({
            document: gql`
            query {
              courses_CourseInstance${id ? getSelectById(id) : ""} {
                courses_hasResultType {
                  _id
                  courses_createdAt
                  courses_minPoints
                  courses_name
                  courses_description
                  courses_correctionFor {
                      _id
                      courses_name
                  }
                }
              }
            }
            `,
          }),
          transformResponse: (response, meta, arg) => response.CourseInstance,
          providesTags: ['Result'],
        }),
        getAllGradings: builder.query({
          query: (id) => ({
            document: gql`
            query {
              courses_CourseInstance${id ? getSelectById(id) : ""} {
                courses_hasGrading {
                  _id
                  courses_createdAt
                  courses_minPoints
                  courses_grade
                }
              }
            }
            `,
          }),
          transformResponse: (response, meta, arg) => response.CourseInstance,
          providesTags: ['Result'],
        }),
        updateCourseInstance: builder.mutation({
          query: ({id, body}) => ({ 
            document: gql`
              mutation {
                update_courses_CourseInstance(
                  _id: "${id}"
                  ${body.fileExplorerRoot ? `courses_fileExplorerRoot: "${body.fileExplorerRoot}"` : ""}
                  ${body.hasResultType ? `courses_hasResultType: ${JSON.stringify(body.hasResultType)}` : ""}
                  ${body.hasPersonalSettings ? `courses_hasPersonalSettings: ${body.hasPersonalSettings}` : ""}
                  ${body.hasGrading ? `courses_hasGrading: ${JSON.stringify(body.hasGrading)}` : ""}
                ) {
                  _id
                }
              }
            `,
          }),
          invalidatesTags: ['Result'],
        }),
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
          providesTags: ['Result'],
        }),
    })
})

export const { 
    useGetResultQuery,
    useLazyGetResultQuery,
    useGetResultTypeQuery,
    useLazyGetResultTypeQuery,

    useGetAllResultTypesQuery,
    useLazyGetAllResultTypesQuery,


    
    useGetCourseGradingQuery,
    useLazyGetCourseHasGradingQuery,
    useGetCourseHasGradingQuery,

    useGetAllGradingsQuery,
    useLazyGetAllGradingsQuery,

    useUpdateResultMutation,
    useUpdateResultTypeMutation,

    useLazyGetCourseHasResultTypeQuery,

    useUpdateCourseGradingMutation,
    useNewResultMutation,
    useNewResultTypeMutation,
    useNewCourseGradingMutation,
    useDeleteResultMutation,
    useDeleteResultTypeMutation,
    useDeleteCourseGradingMutation,

    useUpdateCourseInstanceMutation,
    
    useGetUserQuery,
    
} = resultApi
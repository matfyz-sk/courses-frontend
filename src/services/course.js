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

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['Course'],
    endpoints: (builder) => ({
      getCourse: builder.query({
        query: ({id}) => ({
          document: gql`
            query {
                courses_Course${id ? getSelectById(id) : ""} {
                    _id
                    courses_createdAt
                    courses_name
                    courses_description
                    courses_abbreviation
                    courses_covers {
                      _id
                    }
                    courses_coursePrerequisite {
                      _id
                      courses_name
                    }
                    courses_mentions {
                      _id
                    }
                    courses_hasAdmin {
                      _id
                      courses_firstName
                      courses_lastName
                    }
                }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.Course,
        providesTags: ['Course'],
      }), 
      getCourseInstance: builder.query({
        query: ({id, instructorId}) => ({
          document: gql`
            query {
                courses_CourseInstance${id ? getSelectById(id) : ""} {
                    _id
                    _type
                    courses_location
                    courses_createdAt
                    courses_startDate
                    courses_endDate
                    courses_name
                    courses_description
                    courses_documentReference {
                      _id
                    }
                    courses_course {
                        _id
                        courses_name
                        courses_description
                        courses_abbreviation
                        courses_coursePrerequisite {
                          _id
                          courses_name
                        }
                        courses_hasAdmin {
                          _id
                        }
                    }
                    courses_hasPersonalSettings {
                      _id
                    }
                    courses_uses {
                      _id
                    }
                    courses_recommends {
                      _id
                    }
                    courses_hasGrading {
                      _id
                    }
                    courses_requires {
                      _id
                    }
                    courses_hasDocument {
                      _id
                    }
                    courses_hasResultType {
                      _id
                    }
                    courses_hasInstructor${instructorId ? getSelectById(instructorId) : ""} {
                      _id
                      courses_firstName
                      courses_lastName
                    }
                    courses_covers {
                      _id
                    }
                    courses_mentions {
                      _id
                    }
                    courses_courseInstance {
                      _id
                    }
                    courses_fileExplorerRoot {
                      _id
                    }
                }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.CourseInstance,
        providesTags: ['Course'],
      }),
      updateCourse: builder.mutation({
        query: ({id, body}) => ({ 
          document: gql`
            mutation {
              update_courses_Course(
                _id: "${id}"
                courses_name: "${body.name}"
                courses_description: "${body.description}"
                ${body.abbreviation ? `courses_abbreviation: "${body.abbreviation}"` : ""}
                ${body.hasAdmin ? `courses_hasAdmin: ${JSON.stringify(body.hasAdmin)}` : ""}
                ${body.hasPrerequisite ? `courses_coursePrerequisite: "${JSON.stringify(body.hasPrerequisite)}"` : ""}
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.Course,
        invalidatesTags: ['Course'],
      }),
      updateCourseInstance: builder.mutation({
        query: ({id, body}) => ({ 
          document: gql`
            mutation {
              update_courses_CourseInstance(
                _id: "${id}"
                ${body.startDate ? `courses_startDate: "${body.startDate.toISOString()}"` : ""}
                ${body.endDate ? `courses_endDate: "${body.endDate.toISOString()}"` : ""}
                ${body.fileExplorerRoot ? `courses_fileExplorerRoot: "${body.fileExplorerRoot}"` : ""}
                ${body.hasResultType ? `courses_hasResultType: ${getArrayFormat(body.hasResultType)}` : ""}
                ${body.hasPersonalSettings ? `courses_hasPersonalSettings: ${getArrayFormat(body.hasPersonalSettings)}` : ""}
                ${body.hasGrading ? `courses_hasGrading: ${getArrayFormat(body.hasGrading)}` : ""}
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.CourseInstance,
        invalidatesTags: ['Course'],
      }),
      newCourse: builder.mutation({
        query: (body) => ({ 
          document: gql`
            mutation {
              insert_courses_Course(
                courses_name: "${body.name}"
                courses_description: "${body.description}"
                ${body.abbreviation ? `courses_abbreviation: "${body.abbreviation}"` : ""}
                ${body.hasAdmin ? `courses_hasAdmin: ${JSON.stringify(body.hasAdmin)}` : ""}
                ${body.hasPrerequisite ? `courses_coursePrerequisite: "${JSON.stringify(body.hasPrerequisite)}"` : ""}
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.Course,
        invalidatesTags: ['Course'],
      }),
      newCoursePersonalSettings: builder.mutation({
        query: (body) => ({ 
          document: gql`
            mutation {
              insert_courses_CoursePersonalSettings(
                courses_nickName: "${body.nickName}"
                courses_hasUser: "${body.hasUser}"
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.CoursePersonalSettings,
        invalidatesTags: ['Course'],
      }),
      newCourseInstance: builder.mutation({
        query: (body) => ({ 
          document: gql`
            mutation {
              insert_courses_CourseInstance(
                courses_name: "${body.name}"
                courses_description: "${body.description}"
                courses_startDate: ${body.startDate.toISOString()}
                courses_endDate: ${body.endDate.toISOString()}
                courses_courseInstance: "${body.courseInstance}"
                ${body.hasInstructor ? `courses_hasInstructor: ${body.hasInstructor}` : ""}
                ${body.course ? `courses_course: "${body.course}"` : ""}
                ${body.location ? `courses_location: "${body.location}"` : ""}
                ${body.uses ? `courses_uses: ${body.uses}` : ""}
                ${body.recommends ? `courses_recommends: ${body.recommends}` : ""}
                ${body.documentReference ? `courses_documentReference: ${body.documentReference}` : ""}
                courses_hasDocument: "${body.hasDocument ? body.hasDocument : ""}"
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.CourseInstance,
        invalidatesTags: ['Course'],
      }),
      deleteCourse: builder.mutation({
        query: (id) => ({ 
          document: gql`
            mutation {
              delete_courses_Course(
                _id: "${id}"
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.Course,
        invalidatesTags: ['Course'],
      }),
      deleteCourseInstance: builder.mutation({
        query: (id) => ({ 
          document: gql`
            mutation {
              delete_courses_CourseInstance(
                _id: "${id}"
              ) {
                _id
              }
            }
          `,
        }),
        transformResponse: (response, meta, arg) => response.CourseInstance,
        invalidatesTags: ['Course'],
      }),   
    })
})

export const { 
    useGetCourseQuery,
    useGetCourseInstanceQuery,
    useLazyGetCourseInstanceQuery,
    useUpdateCourseMutation,
    useUpdateCourseInstanceMutation,
    useNewCourseMutation,
    useNewCoursePersonalSettingsMutation,
    useNewCourseInstanceMutation,
    useDeleteCourseMutation,
    useDeleteCourseInstanceMutation,
} = courseApi
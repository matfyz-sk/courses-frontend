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

export const badgeApi = createApi({
  reducerPath: 'badgeApi',
  baseQuery: graphqlBaseQuery({
    url: `${BACKEND_URL}graphql`,
  }),
  tagTypes: ['Badge'],
  endpoints: (builder) => ({
    refreshCache: builder.mutation({
      query: (id) => ({ 
        document: gql`
          mutation {
            update_courses_CourseBadgeType (
              _id: "${id}"
            ){
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    getAllBadgeTypes: builder.query({
      query: (id) => ({
        document: gql`
        query {
          courses_BadgeType {
            _id
            courses_title
            courses_description
            courses_icon
          }
        }
        `,
      }),
      transformResponse: (response, meta, arg) => response.BadgeType,
      providesTags: ['Badge'],
    }),
    getBadgeType: builder.query({
      query: (id) => ({
        document: gql`
        query {
          courses_BadgeType${id ? getSelectById(id) : ""} {
            _id
            courses_title
            courses_description
            courses_icon
          }
        }
        `,
      }),
      transformResponse: (response, meta, arg) => response.BadgeType[0],
      providesTags: ['Badge'],
    }),
    getCourseBadgeTypes: builder.query({
      query: ({id, courseBadgeId}) => ({
        document: gql`
        query {
          courses_CourseBadgeType${courseBadgeId ? getSelectById(courseBadgeId) : ""} {
            _id
            courses_courseInstance${id ? getSelectById(id) : ""}{
              _id
            }
            courses_badgeType {
              _id
              courses_title
              courses_description
              courses_icon
            }
            courses_additional
            courses_canAwardStudent
            courses_canAwardInstructor
            courses_awardableTo
            courses_enabled
            courses_enabledFrom
            courses_enabledUntil
            courses_color
          }
        }
        `,
      }),
      transformResponse: (response, meta, arg) => response.CourseBadgeType ? response.CourseBadgeType.map((item) => 
        ({...item, enabledFrom: new Date(item.enabledFrom.millis), enabledUntil: new Date(item.enabledUntil.millis)})
      ) : response.CourseBadgeType,
      providesTags: ['Badge'],
    }),
    createBadgeType: builder.mutation({
      query: ({body, icon}) => ({ 
        document: gql`
          mutation {
              insert_courses_BadgeType (
                ${body.title ? `courses_title: "${body.title}"` : ""}
                ${body.description ? `courses_description: "${body.description}"` : ""}
                ${icon ? `courses_icon: "${icon}"` : ""}
              ){
                _id
              }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    deleteBadgeType: builder.mutation({
      query: (id) => ({ 
        document: gql`
          mutation {
            delete_courses_BadgeType(
              _id: "${id}"
            ) {
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    updateBadgeType: builder.mutation({
      query: ({id, body, icon}) => ({ 
        document: gql`
          mutation {
              update_courses_BadgeType (
                _id: "${id}"
                ${body.title ? `courses_title: "${body.title}"` : ""}
                ${body.description ? `courses_description: "${body.description}"` : ""}
                ${icon ? `courses_icon: "${icon}"` : ""}
              ){
                _id
              }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    createCourseBadgeType: builder.mutation({
      query: ({instance, type, body}) => ({ 
        document: gql`
          mutation {
            insert_courses_CourseBadgeType (
              ${instance ? `courses_courseInstance: "${instance}"` : ""}
              ${type ? `courses_badgeType: "${type}"` : ""}
              ${body.additional ? `courses_additional: "${body.additional}"` : ""}
              ${body.canAwardStudent ? `courses_canAwardStudent: ${body.canAwardStudent}` : `courses_canAwardStudent: false`}
              ${body.canAwardInstructor ? `courses_canAwardInstructor: ${body.canAwardInstructor}` : `courses_canAwardInstructor: false`}
              courses_awardableTo: "${body.awardableTo}"
              ${body.enabled ? `courses_enabled: ${body.enabled}` : `courses_enabled: false`}
              courses_enabledFrom: "${body.enabledFrom.toISOString()}"
              courses_enabledUntil: "${body.enabledUntil.toISOString()}"
              courses_color: "${body.color}"
            ) {
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response.CourseBadgeType[0]._id,
      invalidatesTags: ['Badge'],
    }),
    deleteCourseBadgeType: builder.mutation({
      query: ({id, badgeTypeId}) => ({ 
        document: gql`
          mutation {
            delete_courses_CourseBadgeType(
              ${id ? `_id: "${id}"` : ""}
              ${badgeTypeId ? `courses_badgeType: "${badgeTypeId}"` : ""}
            ) {
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    updateCourseBadgeType: builder.mutation({
      query: ({id, body, color}) => ({ 
        document: gql`
          mutation {
              update_courses_CourseBadgeType (
                _id: "${id}"
                ${body.additional ? `courses_additional: "${body.additional}"` : ""}
                ${body.canAwardStudent ? `courses_canAwardStudent: ${body.canAwardStudent}` : `courses_canAwardStudent: false`}
                ${body.canAwardInstructor ? `courses_canAwardInstructor: ${body.canAwardInstructor}` : `courses_canAwardInstructor: false`}
                courses_awardableTo: "${body.awardableTo}"
                ${body.enabled ? `courses_enabled: ${body.enabled}` : `courses_enabled: false`}
                courses_enabledFrom: "${body.enabledFrom.toISOString()}"
                courses_enabledUntil: "${body.enabledUntil.toISOString()}"
                courses_color: "${body.color}"
            ){
                  _id
              }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response.CourseBadgeType[0]._id,
      invalidatesTags: ['Badge'],
    }),
    createAwardableBadge: builder.mutation({
      query: ({instance, type, user, color}) => ({
        document: gql`
          mutation {
            insert_courses_AwardableBadge (
              ${instance ? `courses_courseInstance: "${instance}"` : ""}
              ${type ? `courses_badgeType: "${type}"` : ""}
              ${user ? `courses_hasUser: "${user}"` : ""}
              courses_awardedTo: ""
              courses_awardComment: ""
              courses_additional: ""
              courses_color: "${color}"
            ){
                _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    updateAwardableBadge: builder.mutation({
      query: ({id, user, comment, awardedOn}) => ({
        document: gql`
          mutation {
            update_courses_AwardableBadge (
              _id: "${id}"
              courses_awardedTo: "${user}"
              courses_awardComment: "${comment}"
              courses_awardedOn: "${awardedOn.toISOString()}"
            ){
                _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    getAwardableBadges: builder.query({
      query: ({id, awarded}) => ({
        document: gql`
        query {
          courses_AwardableBadge {
            _id
            courses_hasUser${id ? getSelectById(id) : ""}{
              _id
            }
            courses_courseBadgeType {
              _id
            }
            courses_badgeType {
              _id
            }
            courses_awardableTo
            courses_awardedTo${awarded ? getSelectById(awarded) : ""}{
              _id
            }
            courses_awardComment
            courses_additional
            courses_awardedOn
            courses_color
          }
        }
        `,
      }),
      transformResponse: (response, meta, arg) => response.AwardableBadge ? response.AwardableBadge.map((item) => 
        item.awardedTo ? ({...item, awardedOn: new Date(item.awardedOn.millis)}) : item)
      : response.AwardableBadge,
      providesTags: ['Badge'],
    }),
    deleteAwardableBadge: builder.mutation({
      query: ({id, badgeTypeId, awarded}) => ({ 
        document: gql`
          mutation {
            delete_courses_AwardableBadge(
              ${awarded ? "" : `courses_awardedTo: ""`}
              ${id ? `courses_courseBadgeType: "${id}"` : ""}
              ${badgeTypeId ? `courses_badgeType: "${badgeTypeId}"` : ""}
            ) {
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response,
      invalidatesTags: ['Badge'],
    }),
    updateCourseInstance: builder.mutation({
      query: ({id, body}) => ({ 
        document: gql`
          mutation {
            update_courses_CourseInstance(
              _id: "${id}"
              ${body.hasBadgeType ? `courses_hasBadgeType: ${JSON.stringify(body.hasBadgeType)}` : ""}
            ) {
              _id
            }
          }
        `,
      }),
      transformResponse: (response, meta, arg) => response.CourseInstance,
      invalidatesTags: ['Badge'],
    }),
  })
})

export const {
    useRefreshCacheMutation, 
    useUpdateCourseInstanceMutation,

    useCreateBadgeTypeMutation,
    useGetAllBadgeTypesQuery,
    useGetBadgeTypeQuery,
    useUpdateBadgeTypeMutation,
    useDeleteBadgeTypeMutation,

    useCreateCourseBadgeTypeMutation,
    useGetCourseBadgeTypesQuery,
    useUpdateCourseBadgeTypeMutation,
    useDeleteCourseBadgeTypeMutation,

    useCreateAwardableBadgeMutation,
    useGetAwardableBadgesQuery,
    useDeleteAwardableBadgeMutation,
    useUpdateAwardableBadgeMutation,

} = badgeApi
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

export const assignmentGraphApi = createApi({
    reducerPath: 'assignmentGraphApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['Assignment'],
    endpoints: (builder) => ({
        getAssignment: builder.query({
            query: ({id, courseInstanceId}) => ({
              document: gql`
                query {
                    courses_Assignment${id ? getSelectById(id) : ""} {
                        _id
                        courses_description
                        courses_name
                        courses_teamsMinimumInTeam
                        courses_hasAssignedReviews
                        courses_teamsSubmittedAsTeam
                        courses_reviewsDisabled
                        courses_submissionAnonymousSubmission
                        courses_shortDescription
                        courses_submissionImprovedSubmission
                        courses_reviewsVisibility
                        courses_reviewsPerSubmission
                        courses_createdAt
                        courses_teamsMultipleSubmissions 
                        courses_teamReviewsDisabled
                        courses_teamsDisabled
                        courses_teamsMaximumInTeam
                        courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                            _id
                        }
                        courses_mentions {
                            _id
                        }
                        courses_covers {
                            _id
                        }
                        courses_requires {
                            _id
                        }
                        courses_initialSubmissionPeriod {
                            _id
                        }
                        courses_peerReviewPeriod {
                            _id
                        }
                        courses_teamReviewPeriod {
                            _id
                        }
                        courses_reviewedByTeam {
                            _id
                        }
                        courses_hasField {
                            _id
                        }
                        courses_hasMaterial {
                            _id
                        }
                        courses_improvedSubmissionPeriod {
                            _id
                        }
                        courses_reviewsQuestion {
                            _id
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Assignment,
            providesTags: ['Assignment'],
        }),  
        getAssignmentPeriod: builder.query({
            query: (id) => ({
              document: gql`
                query {
                    courses_AssignmentPeriod${id ? getSelectById(id) : ""} {
                    _id
                    courses_location
                    courses_createdAt
                    courses_name
                    courses_description
                    courses_openTime
                    courses_extraTime
                    courses_deadline
                    courses_startDate
                    courses_endDate
                    courses_courseInstance {
                        _id
                    }
                    courses_task {
                        _id
                    }
                    courses_documentReference {
                        _id
                    }
                    courses_covers {
                        _id
                    }
                    courses_requires {
                        _id
                    }
                    courses_uses {
                        _id
                    }
                    courses_recommends {
                        _id
                    }
                    courses_mentions {
                        _id
                    }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.AssignmentPeriod,
            providesTags: ['Assignment'],
        }), 
        getSubmission: builder.query({
            query: ({assignmentId, teamId, studentId}) => ({
              document: gql`
                query {
                    courses_Submission {
                    _id
                    courses_createdAt
                    courses_teacherRating
                    courses_hasTeacherComment
                    courses_isComplete
                    courses_isImproved
                    courses_ofAssignment${assignmentId ? getSelectById(assignmentId) : ""} {
                        _id
                    }
                    courses_submittedField {
                        _id
                    }
                    courses_submittedByStudent${studentId ? getSelectById(studentId) : ""} {
                        _id
                    }
                    courses_submittedByTeam${teamId ? getSelectById(teamId) : ""} {
                        _id
                    }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Submission,
            providesTags: ['Assignment'],
        }), 
        getSubmittedField: builder.query({
            query: (id) => ({
              document: gql`
                query {
                    courses_SubmittedField${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_field
                        courses_value
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.SubmittedField,
            providesTags: ['Assignment'],
        }),
        getField: builder.query({
            query: (id) => ({
              document: gql`
                query {
                    courses_Field${id ? getSelectById(id) : ""} {
                        _id
                        courses_createdAt
                        courses_label
                        courses_fieldType
                        courses_name
                        courses_description
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Field,
            providesTags: ['Assignment'],
        }),
        newAssignment: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_Assignment(
                        ${body.name ? `courses_name: "${body.name}"` : ""}
                        ${body.shortDescription ? `courses_shortDescription: "${body.shortDescription}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.submissionAnonymousSubmission ? `courses_submissionAnonymousSubmission: ${body.submissionAnonymousSubmission}` : ""}
                        ${body.submissionImprovedSubmission ? `courses_submissionImprovedSubmission: ${body.submissionImprovedSubmission}` : ""}
                        ${body.teamsDisabled ? `courses_teamsDisabled: ${body.teamsDisabled}` : ""}
                        ${body.reviewsDisabled ? `courses_reviewsDisabled: ${body.reviewsDisabled}` : ""}
                        ${body.teamReviewsDisabled ? `courses_teamReviewsDisabled: ${body.teamReviewsDisabled}` : ""}
                        ${body.hasMaterial ? `courses_hasMaterial: ["${body.hasMaterial}"]` : ""}
                        ${body.hasField ? `courses_hasField: ["${body.hasField}"]` : ""}
                        ${body.reviewsQuestion ? `courses_reviewsQuestion: ["${body.reviewsQuestion}"]` : ""}
                        ${body.teamsSubmittedAsTeam ? `courses_teamsSubmittedAsTeam: "${body.teamsSubmittedAsTeam}"` : ""}
                        ${body.teamsMinimumInTeam ? `courses_teamsMinimumInTeam: ${body.teamsMinimumInTeam}` : ""}
                        ${body.teamsMaximumInTeam ? `courses_teamsMaximumInTeam: ${body.teamsMaximumInTeam}` : ""}
                        ${body.teamsMultipleSubmissions ? `courses_teamsMultipleSubmissions: ${body.teamsMultipleSubmissions}` : ""}
                        ${body.reviewsPerSubmission ? `courses_reviewsPerSubmission: ${body.reviewsPerSubmission}` : ""}
                        ${body.reviewedByTeam ? `courses_reviewedByTeam_as_courses_Team: "${body.reviewedByTeam}"` : ""}
                        ${body.reviewsVisibility ? `courses_reviewsVisibility: "${body.reviewsVisibility}"` : ""}
                        ${body.initialSubmissionPeriod ? `courses_initialSubmissionPeriod: "${body.initialSubmissionPeriod}"` : ""}
                        ${body.improvedSubmissionPeriod ? `courses_improvedSubmissionPeriod: "${body.improvedSubmissionPeriod}"` : ""}
                        ${body.peerReviewPeriod ? `courses_peerReviewPeriod: "${body.peerReviewPeriod}"` : ""}
                        ${body.teamReviewPeriod ? `courses_teamReviewPeriod: "${body.teamReviewPeriod}"` : ""}
                        ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                        ${body.hasAssignedReviews ? `courses_hasAssignedReviews: ${body.hasAssignedReviews}` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Assignment,
            invalidatesTags: ['Assignment'],
        }),
        newSubmittedField: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    insert_courses_SubmittedField(
                        courses_value: "${body.value}"
                        courses_field: "${body.field}"
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.SubmittedField,
            invalidatesTags: ['Assignment'],
        }),
        newSubmission: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_Submission(
                        courses_ofAssignment: "${body.ofAssignment}"
                        courses_submittedField: "${body.submittedField}"
                        ${body.isComplete ? `courses_isComplete: ${body.isComplete}` : ""}
                        ${body.isImproved ? `courses_isImproved: ${body.isImproved}` : ""}
                        ${body.teacherRating ? `courses_teacherRating: ${body.teacherRating}` : ""}
                        ${body.submittedByTeam ? `courses_submittedByTeam: "${body.submittedByTeam}"` : ""}
                        ${body.hasTeacherComment ? `courses_hasTeacherComment: "${body.hasTeacherComment}"` : ""}
                        ${body.submittedByStudent ? `courses_submittedByStudent: "${body.submittedByStudent}"` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Submission,
            invalidatesTags: ['Assignment'],
        }),
        newAssignmentPeriod: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_AssignmentPeriod(
                        courses_openTime: "${body.openTime}"
                        courses_deadline: "${body.deadline}"
                        courses_extraTime: "${body.extraTime}"
                        courses_startDate: "${body.startDate}"
                        courses_endDate: "${body.endDate}"
                        courses_courseInstance: "${body.courseInstance}"                
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.AssignmentPeriod,
            invalidatesTags: ['Assignment'],
        }),
        newField: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                    insert_courses_Field(
                        courses_name: "${body.name}"
                        courses_description: "${body.description}"
                        courses_label: "${body.label}"
                        courses_fieldType: "${body.fieldType}"
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Field,
            invalidatesTags: ['Assignment'],
        }),
        updateAssignment: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_Assignment(
                        _id: "${id}"
                        ${body.name ? `courses_name: "${body.name}"` : ""}
                        ${body.shortDescription ? `courses_shortDescription: "${body.shortDescription}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.submissionAnonymousSubmission ? `courses_submissionAnonymousSubmission: ${body.submissionAnonymousSubmission}` : ""}
                        ${body.submissionImprovedSubmission ? `courses_submissionImprovedSubmission: ${body.submissionImprovedSubmission}` : ""}
                        ${body.teamsDisabled ? `courses_teamsDisabled: ${body.teamsDisabled}` : ""}
                        ${body.reviewsDisabled ? `courses_reviewsDisabled: ${body.reviewsDisabled}` : ""}
                        ${body.teamReviewsDisabled ? `courses_teamReviewsDisabled: ${body.teamReviewsDisabled}` : ""}
                        ${body.hasMaterial ? `courses_hasMaterial: ["${body.hasMaterial}"]` : ""}
                        ${body.hasField ? `courses_hasField: ["${body.hasField}"]` : ""}
                        ${body.reviewsQuestion ? `courses_reviewsQuestion: ["${body.reviewsQuestion}"]` : ""}
                        ${body.teamsSubmittedAsTeam ? `courses_teamsSubmittedAsTeam: "${body.teamsSubmittedAsTeam}"` : ""}
                        ${body.teamsMinimumInTeam ? `courses_teamsMinimumInTeam: ${body.teamsMinimumInTeam}` : ""}
                        ${body.teamsMaximumInTeam ? `courses_teamsMaximumInTeam: ${body.teamsMaximumInTeam}` : ""}
                        ${body.teamsMultipleSubmissions ? `courses_teamsMultipleSubmissions: ${body.teamsMultipleSubmissions}` : ""}
                        ${body.reviewsPerSubmission ? `courses_reviewsPerSubmission: ${body.reviewsPerSubmission}` : ""}
                        ${body.reviewedByTeam ? `courses_reviewedByTeam_as_courses_Team: "${body.reviewedByTeam}"` : ""}
                        ${body.reviewsVisibility ? `courses_reviewsVisibility: "${body.reviewsVisibility}"` : ""}
                        ${body.initialSubmissionPeriod ? `courses_initialSubmissionPeriod: "${body.initialSubmissionPeriod}"` : ""}
                        ${body.improvedSubmissionPeriod ? `courses_improvedSubmissionPeriod: "${body.improvedSubmissionPeriod}"` : ""}
                        ${body.peerReviewPeriod ? `courses_peerReviewPeriod: "${body.peerReviewPeriod}"` : ""}
                        ${body.teamReviewPeriod ? `courses_teamReviewPeriod: "${body.teamReviewPeriod}"` : ""}
                        ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                        ${body.hasAssignedReviews ? `courses_hasAssignedReviews: ${body.hasAssignedReviews}` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Assignment,
            invalidatesTags: ['Assignment'],
        }),
        updateSubmittedField: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_SubmittedField(
                        _id: "${id}"
                        ${body.value ? `courses_value: "${body.value}"` : ""}
                        ${body.field ? `courses_field: "${body.field}"` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.SubmittedField,
            invalidatesTags: ['Assignment'],
        }),
        updateSubmission: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_Submission(
                        _id: "${id}"
                        courses_ofAssignment: "${body.ofAssignment}"
                        courses_submittedField: "${body.submittedField}"
                        ${body.isComplete ? `courses_isComplete: ${body.isComplete}` : ""}
                        ${body.isImproved ? `courses_isImproved: ${body.isImproved}` : ""}
                        ${body.teacherRating ? `courses_teacherRating: ${body.teacherRating}` : ""}
                        ${body.submittedByTeam ? `courses_submittedByTeam: "${body.submittedByTeam}"` : ""}
                        ${body.hasTeacherComment ? `courses_hasTeacherComment: "${body.hasTeacherComment}"` : ""}
                        ${body.submittedByStudent ? `courses_submittedByStudent: "${body.submittedByStudent}"` : ""}
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Submission,
            invalidatesTags: ['Assignment'],
        }),
        updateAssignmentPeriod: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_AssignmentPeriod(
                        _id: "${id}"
                        courses_openTime: "${body.openTime}"
                        courses_deadline: "${body.deadline}"
                        courses_extraTime: "${body.extraTime}"
                        courses_startDate: "${body.startDate}"
                        courses_endDate: "${body.endDate}"                    
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.AssignmentPeriod,
            invalidatesTags: ['Assignment'],
        }),
        updateField: builder.mutation({
            query: ({id, body}) => ({ 
              document: gql`
                mutation {
                    update_courses_Field(
                        _id: "${id}"
                        courses_name: "${body.name}"
                        courses_description: "${body.description}"
                        courses_label: "${body.label}"
                        courses_fieldType: "${body.fieldType}"
                    ) {
                        _id
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Field,
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignment: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_Assignment(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Assignment,
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignmentPeriod: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_AssignmentPeriod(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.AssignmentPeriod,
            invalidatesTags: ['Assignment'],
        }),
        deleteAssignmentPeerReviewPeriod: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_AssignmentPeriod(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.AssignmentPeriod,
            invalidatesTags: ['Assignment'],
        }),
        deleteField: builder.mutation({
            query: (id) => ({ 
              document: gql`
                mutation {
                  delete_courses_Field(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Field,
            invalidatesTags: ['Assignment'],
        }),
    }),
})

export const {
    useGetAssignmentQuery,
    useLazyGetAssignmentQuery,
    useGetAssignmentPeriodQuery,
    useLazyGetAssignmentPeriodQuery,
    useGetSubmissionQuery,
    useLazyGetSubmissionQuery,
    useGetSubmittedFieldQuery,
    useLazyGetSubmittedFieldQuery,
    useGetFieldQuery,
    useLazyGetFieldQuery,
    useNewAssignmentMutation,
    useNewAssignmentPeriodMutation,
    useNewSubmissionMutation,
    useNewFieldMutation,
    useNewSubmittedFieldMutation,
    useUpdateAssignmentMutation,
    useUpdateAssignmentPeriodMutation,
    useUpdateSubmissionMutation,
    useUpdateFieldMutation,
    useUpdateSubmittedFieldMutation,
    useDeleteAssignmentMutation,
    useDeleteAssignmentPeriodMutation,
    useDeleteAssignmentPeerReviewPeriodMutation,
    useDeleteFieldMutation,
} = assignmentGraphApi
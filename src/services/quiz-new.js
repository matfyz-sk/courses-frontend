import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from '../constants'
import { gql } from 'graphql-request'
import { getOrderBy, getSelectById, graphqlBaseQuery } from './baseQuery'

export const quizNewApi = createApi({
  reducerPath: 'quizNewApi',
  baseQuery: graphqlBaseQuery({
    url: `${BACKEND_URL}graphql`,
  }),
  tagTypes: ['Question', 'Questions', 'Comments'],
  endpoints: builder => ({
    addNewMultipleChoiceAnswer: builder.mutation({
      query: body => ({
        document: gql`
        mutation {
          insert_courses_PredefinedAnswer (
            courses_text: "${body.text}"
            courses_correct: ${body.correct}
          ) {
          _id
          }
        }`,
      }),
      transformResponse: response => response.PredefinedAnswer[0]._id,
    }),
    addNewMultipleChoiceQuestion: builder.mutation({
      query: ({ body, userId }) => ({
        document: gql`
          mutation {
            insert_courses_QuestionWithPredefinedAnswer (
              courses_text: "${body.text}"
              courses_courseInstance: "${body.courseInstance}"
              courses_hasPredefinedAnswer: ${body.hasPredefinedAnswer}
              courses_previous: "${body.previous}"
              courses_questionSubmittedBy: "${userId}"
            )
            {
              _id
              courses_courseInstance {
                _id
                courses_location
                courses_createdAt
                _type
              }
              courses_questionSubmittedBy {
                _id
              }
            }
          }
        `,
      }),
      invalidatesTags: ['Questions'],
    }),
    getQuestions: builder.query({
      query: ({ courseInstanceId }) => ({
        document: gql`
          query {
            courses_QuestionWithPredefinedAnswer {
              _id
              courses_text
              courses_courseInstance${getSelectById(courseInstanceId)} {
                _id
              }
              courses_hasPredefinedAnswer {
                _id
                courses_text
                courses_correct
              }
              courses_approver {
                _id
              }
              courses_previous {
                _id
              }
              courses_createdAt(order: DESC)
              courses_questionSubmittedBy {
                _id
              }
            }
          }
        `,
      }),
      transformResponse: response => response.QuestionWithPredefinedAnswer,
      providesTags: ['Questions'],
    }),
    getQuestionById: builder.query({
      query: ({ courseInstanceId, questionId }) => ({
        document: gql`
          query {
            courses_QuestionWithPredefinedAnswer${getSelectById(questionId)} {
              _id
              courses_text
              courses_courseInstance${getSelectById(courseInstanceId)} {
                _id
              }
              courses_hasPredefinedAnswer {
                _id
                courses_text
                courses_correct
              }
              courses_previous {
                _id
              }
              courses_approver {
                _id
              }
              courses_questionSubmittedBy {
                _id
              }
              courses_comment {
                _id
                courses_commentText
                courses_createdAt(order: ASC)
                courses_commentCreatedBy {
                  _id
                  courses_firstName
                  courses_lastName
                }
              }
            }
          }
        `,
      }),
      providesTags: ['Question', 'Comments'],
      transformResponse: response => response.QuestionWithPredefinedAnswer[0],
    }),
    addNewComment: builder.mutation({
      query: ({ questionId, commentBody }) => ({
        document: gql`
          mutation {
            insert_courses_Comment (
              courses_commentText: "${commentBody.commentText ?? ''}"
              courses_commentCreatedBy: "${commentBody.commentCreatedBy ?? ''}"
            ) {
              _id
            }
          }
        `,
      }),

      transformResponse: response => response.Comment[0]._id,
    }),
    updateQuestion: builder.mutation({
      query: ({ questionId, questionBody }) => ({
        document: gql`
          mutation {
            update_courses_QuestionWithPredefinedAnswer (
              _id: "${questionId}"
              ${
                questionBody.comments
                  ? `courses_comment: ${questionBody.comments}`
                  : ``
              }
              ${
                questionBody.approver
                  ? `courses_approver: "${questionBody.approver}"`
                  : ``
              }
            ) {
              _id
              courses_comment {
                _id
              }
              courses_approver {
                _id
              }
            }
          }
        `,
      }),
      invalidatesTags: ['Comments'],
    }),
    deleteQuestion: builder.mutation({
      query: questionId => ({
        document: gql`
          mutation {
            delete_courses_Question (
              _id: ${questionId}
            }
          }
        `,
      }),
    }),
  }),
})

export const {
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useSetHasNewerVersionMutation,
  useAddNewMultipleChoiceAnswerMutation,
  useAddNewMultipleChoiceQuestionMutation,
  useAddNewCommentMutation,
  useUpdateQuestionMutation,
} = quizNewApi

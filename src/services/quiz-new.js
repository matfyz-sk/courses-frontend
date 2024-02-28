import { createApi } from '@reduxjs/toolkit/query/react'
import { BACKEND_URL } from '../constants'
import { gql } from 'graphql-request'
import { getOrderBy, getSelectById, graphqlBaseQuery } from './baseQuery'

export const quizNewApi = createApi({
  reducerPath: 'quizNewApi',
  baseQuery: graphqlBaseQuery({
    url: `${BACKEND_URL}graphql`,
  }),
  tagTypes: ['Question', 'Questions'],
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
              courses_hasNewerVersion: false
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
    setHasNewerVersion: builder.mutation({
      query: questionId => ({
        document: gql`
        mutation {
          update_courses_QuestionWithPredefinedAnswer (
            _id: "${questionId}"
            courses_hasNewerVersion: true
          ) {
            _id
          }
        }
        `,
      }),
      invalidatesTags: ['Question'],
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
              courses_previous {
                _id
              }
              courses_createdAt(order: DESC)
              courses_questionSubmittedBy {
                _id
              }
              courses_hasNewerVersion
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
              courses_hasNewerVersion
              courses_questionSubmittedBy {
                _id
              }
            }
          }
        `,
      }),
      providesTags: ['Question'],
      transformResponse: response => response.QuestionWithPredefinedAnswer[0],
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
} = quizNewApi

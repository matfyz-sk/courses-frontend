import { createApi } from "@reduxjs/toolkit/query/react"
import { BACKEND_URL } from "../constants"
import { gql } from "graphql-request"
import { getArrayFormat, getSelectById, graphqlBaseQuery } from "./baseQuery"

export const topicApi = createApi({
    reducerPath: "topicApi",
    baseQuery: graphqlBaseQuery({
        url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ["Topic"],
    endpoints: builder => ({
        getTopic: builder.query({
            query: id => ({
                document: gql`
                query {
                    courses_Topic${getSelectById(id)} {
                        _id
                        courses_createdAt
                        courses_name
                        courses_description
                        courses_topicPrerequisite {
                            _id
                            courses_name
                        }
                        courses_subtopicOf {
                            _id
                            courses_name
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Topic[0],
            providesTags: ["Topic"],
        }),
        getTopics: builder.query({
            query: () => ({
                document: gql`
                    query {
                        courses_Topic {
                            _id
                            courses_createdAt
                            courses_name
                            courses_description
                            courses_topicPrerequisite {
                                _id
                                courses_name
                            }
                            courses_subtopicOf {
                                _id
                                courses_name
                            }
                        }
                    }
                `,
            }),
            transformResponse: (response, meta, arg) => response.Topic ?? [],
            providesTags: ["Topic"],
        }),
        newTopic: builder.mutation({
            query: body => ({
                document: gql`
            mutation {
                insert_courses_Topic(
                    courses_name: "${body.name}"
                    ${body.description ? `courses_description: "${body.description}"` : ""}
                    ${body.subtopicOf ? `courses_subtopicOf: ${getArrayFormat(body.subtopicOf)}` : ""}
                    ${
                        body.topicPrerequisite
                            ? `courses_topicPrerequisite: ${getArrayFormat(body.topicPrerequisite)}`
                            : ""
                    }
               ) {
                _id
               }
            }
          `,
            }),
            transformResponse: (response, meta, arg) => response.Topic[0],
            invalidatesTags: ["Topic"],
        }),
        updateTopic: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                    update_courses_Topic(
                        _id: "${id}",
                        ${body.name ? `courses_name: "${body.name}"` : ""}
                        ${body.description ? `courses_description: "${body.description}"` : ""}
                        ${body.subtopicOf ? `courses_subtopicOf: ${getArrayFormat(body.subtopicOf)}` : ""}
                        ${
                            body.topicPrerequisite
                                ? `courses_topicPrerequisite: ${getArrayFormat(body.topicPrerequisite)}`
                                : ""
                        }
                   ) {
                        _id
                   }
                }
            `,
            }),
            transformResponse: (response, meta, arg) => response.Topic[0],
            invalidatesTags: ["Topic"],
        }),
        deleteTopic: builder.mutation({
            query: id => ({
                document: gql`
                    mutation {
                        delete_courses_Topic(_id: "${id}") {
                            _type
                        }
                    }
              `,
            }),
            invalidatesTags: ["Topic"],
        }),
    }),
})

export const {
    useGetTopicQuery,
    useGetTopicsQuery,
    useNewTopicMutation,
    useUpdateTopicMutation,
    useDeleteTopicMutation,
} = topicApi

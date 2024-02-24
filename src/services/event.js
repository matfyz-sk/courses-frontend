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

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: graphqlBaseQuery({
      url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ['Event'],
    endpoints: (builder) => ({
        getEvent: builder.query({
            query: ({id, courseInstanceId}) => ({
              document: gql`
                query { 
                    courses_Event${id ? getSelectById(id) : ""} {
                        _id
                        courses_name
                        courses_description
                        courses_startDate
                        courses_endDate
                        courses_location
                        courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                            _id
                        }
                        courses_recommends {
                            _id
                        }
                        courses_uses {
                            _id
                        }
                        courses_requires {
                            _id
                        }
                        courses_documentReference {
                            _id
                        }
                        courses_covers {
                            _id
                        }
                        courses_mentions {
                            _id
                        }
                    }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Event,
            providesTags: ['Event'],
        }),
        getEventByType: builder.query({
          query: ({id, type, courseInstanceId}) => ({
            document: gql`
              query { 
                  courses_${type}${id ? getSelectById(id) : ""} {
                      _id
                      _type
                      courses_name
                      courses_description
                      courses_startDate
                      courses_endDate
                      courses_location
                      courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                          _id
                      }
                      courses_recommends {
                          _id
                      }
                      courses_uses {
                          _id
                      }
                      courses_requires {
                          _id
                      }
                      courses_documentReference {
                          _id
                      }
                      courses_covers {
                          _id
                      }
                      courses_mentions {
                          _id
                      }
                  }
              }
            `,
          }),
          transformResponse: (response, meta, arg) => {
            return (
            new Array().concat(
              response.Event, 
              response.Block,
              response.Lab,
              response.Session,
              response.Lecture
            ).filter(e => e !== undefined)
          )},
          providesTags: ['Event'],
      }),
        getTimelineEvents: builder.query({
          query: ({courseInstanceId}) => ({
            document: gql`
              query { 
                  courses_Event {
                      _id
                      _type
                      courses_name
                      courses_description
                      courses_startDate
                      courses_endDate
                      courses_location
                      courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                          _id
                          courses_hasInstructor {
                            _id
                          }
                          courses_course {
                            courses_abbreviation
                          }
                      }
                      courses_recommends {
                          _id
                      }
                      courses_uses {
                          _id
                      }
                      courses_requires {
                          _id
                      }
                      courses_documentReference {
                          _id
                      }
                      courses_covers {
                          _id
                      }
                      courses_mentions {
                          _id
                      }
                  }
                  courses_Block {
                    _id
                    _type
                    courses_name
                    courses_description
                    courses_startDate
                    courses_endDate
                    courses_location
                    courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                        _id
                        courses_hasInstructor {
                          _id
                        }
                        courses_course {
                          courses_abbreviation
                        }
                    }
                    courses_recommends {
                        _id
                    }
                    courses_uses {
                        _id
                    }
                    courses_requires {
                        _id
                    }
                    courses_documentReference {
                        _id
                    }
                    courses_covers {
                        _id
                    }
                    courses_mentions {
                        _id
                    }
                  }
                  courses_Lab {
                    _id
                    _type
                    courses_name
                    courses_description
                    courses_startDate
                    courses_endDate
                    courses_location
                    courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                        _id
                        courses_hasInstructor {
                          _id
                        }
                        courses_course {
                          courses_abbreviation
                        } 
                    }
                    courses_recommends {
                        _id
                    }
                    courses_uses {
                        _id
                    }
                    courses_requires {
                        _id
                    }
                    courses_documentReference {
                        _id
                    }
                    courses_covers {
                        _id
                    }
                    courses_mentions {
                        _id
                    }
                  }
                  courses_Session {
                    _id
                    _type
                    courses_name
                    courses_description
                    courses_startDate
                    courses_endDate
                    courses_location
                    courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                        _id
                        courses_hasInstructor {
                          _id
                        }
                        courses_course {
                          courses_abbreviation
                        }
                    }
                    courses_recommends {
                        _id
                    }
                    courses_uses {
                        _id
                    }
                    courses_requires {
                        _id
                    }
                    courses_documentReference {
                        _id
                    }
                    courses_covers {
                        _id
                    }
                    courses_mentions {
                        _id
                    }
                  }
                  courses_Lecture {
                    _id
                    _type
                    courses_name
                    courses_description
                    courses_startDate
                    courses_endDate
                    courses_location
                    courses_courseInstance${courseInstanceId ? getSelectById(courseInstanceId) : ""} {
                        _id
                        courses_hasInstructor {
                          _id
                        }
                        courses_course {
                          courses_abbreviation
                        }
                    }
                    courses_recommends {
                        _id
                    }
                    courses_uses {
                        _id
                    }
                    courses_requires {
                        _id
                    }
                    courses_documentReference {
                        _id
                    }
                    courses_covers {
                        _id
                    }
                    courses_mentions {
                        _id
                    }
                  }
              }
            `,
          }),
          transformResponse: (response, meta, arg) => {
            return (
            new Array().concat(
              response.Event, 
              response.Block,
              response.Lab,
              response.Session,
              response.Lecture
            ).filter(e => e !== undefined)
          )},
          providesTags: ['Event'],
        }),  
        newTimelineBlock: builder.mutation({
            query: (body) => ({ 
              document: gql`
                mutation {
                  insert_courses_Block(
                    courses_name: "${body.name}"
                    courses_description: "${body.description}"
                    courses_startDate: "${body.startDate.toISOString()}"
                    courses_endDate: "${body.endDate.toISOString()}"
                    courses_courseInstance: "${body.courseInstance}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response.Block,
            invalidatesTags: ['Event'],
        }),
        newEventByType: builder.mutation({
            query: ({type, body}) => ({ 
              document: gql`
                mutation {
                  ${getEventHeaderByType("insert", type)}(
                    courses_name: "${body.name}"
                    courses_description: "${body.description}"
                    courses_startDate: "${body.startDate.toISOString()}"
                    courses_endDate: "${body.endDate.toISOString()}"
                    ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                    ${body.location ? `courses_location: "${body.location}"` : ""}
                    ${body.uses ? `courses_uses: ${JSON.stringify(body.uses)}` : ""}
                    ${body.recommends ? `courses_recommends: ${JSON.stringify(body.recommends)}` : ""}
                    ${body.documentReference ? `courses_documentReference: ${JSON.stringify(body.documentReference)}` : ""}
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
        updateEventByType: builder.mutation({
            query: ({id, type, body}) => ({ 
              document: gql`
                mutation {
                  ${getEventHeaderByType("update", type)}(
                    _id: "${id}"
                    courses_name: "${body.name}"
                    courses_description: "${body.description}"
                    courses_startDate: "${body.startDate.toISOString()}"
                    courses_endDate: "${body.endDate.toISOString()}"
                    ${body.location ? `courses_location: "${body.location}"` : ""}
                    ${body.uses ? `courses_uses: ${JSON.stringify(body.uses)}` : ""}
                    ${body.recommends ? `courses_recommends: ${JSON.stringify(body.recommends)}` : ""}
                    ${body.documentReference ? `courses_documentReference: ${JSON.stringify(body.documentReference)}` : ""}
                    ${body.hasInstructor ? `courses_hasInstructor: ${JSON.stringify(body.hasInstructor)}` : ""}
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
        deleteEventByType: builder.mutation({
            query: ({id, type}) => ({ 
              document: gql`
                mutation {
                  ${getEventHeaderByType("delete", type)}(
                    _id: "${id}"
                  ) {
                    _id
                  }
                }
              `,
            }),
            transformResponse: (response, meta, arg) => response,
            invalidatesTags: ['Event'],
        }),
    }),
})

export const { 
    useGetEventQuery,
    useGetEventByTypeQuery,
    useGetTimelineEventsQuery,
    useLazyGetEventQuery,
    useLazyGetTimelineEventsQuery,
    useNewEventByTypeMutation,
    useNewTimelineBlockMutation,
    useUpdateEventByTypeMutation,
    useDeleteEventByTypeMutation,
} = eventApi


const getEventHeaderByType = (prefix, type) => { 
    return prefix + "_courses_" + type 
} 
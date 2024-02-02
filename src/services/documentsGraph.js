import { createApi } from "@reduxjs/toolkit/query/react"
import { BACKEND_URL } from "../constants"
import { gql } from "graphql-request"
import { getArrayFormat, getNonStringEquals, getSelectById, graphqlBaseQuery, } from "./baseQuery"
import { DocumentEnums, getIdByEntityName } from "../pages/documents/common/enums/document-enums"
import { DATA_PREFIX } from "../constants/ontology";

// This is a workaround for the fact that UltraGraphQL ignores actual _type field data and instead uses the targetType from schema
export const syncIdAndTypeOfEntities = entities => {
    return entities.map(entity => {
        const shortType = entity._id.split("/").at(-2)
        return {
            ...entity,
            _type: getIdByEntityName(shortType),
        }
    })
}

export const documentsGraphApi = createApi({
    reducerPath: "documentsGraphApi",
    baseQuery: graphqlBaseQuery({
        url: `${BACKEND_URL}graphql`,
    }),
    tagTypes: ["Folder", "Externaldocument", "Internaldocument", "File", "DocumentReference"],
    endpoints: builder => ({
        getDeletedDocuments: builder.query({
            query: ({ courseInstanceId }) => {
                return {
                    document: gql`
                        query {
                          courses_Internaldocument {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_courseInstances${getSelectById(courseInstanceId)} {
                              _id
                            }
                          }
                          courses_Externaldocument {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_courseInstances${getSelectById(courseInstanceId)} {
                              _id
                            }
                          }
                          courses_File {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_courseInstances${getSelectById(courseInstanceId)} {
                              _id
                            }
                          }
                        }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                let documents = []
                try {
                    documents = [
                        ...response.Internaldocument?.filter(entity => entity.isDeleted === true) ?? [],
                        ...response.Externaldocument?.filter(entity => entity.isDeleted === true) ?? [],
                        ...response.File?.filter(entity => entity.isDeleted === true) ?? []
                    ]
                } catch {
                    return []
                }
                return syncIdAndTypeOfEntities(documents)
            },
            providesTags: ["Externaldocument", "Internaldocument", "File"],
        }),
        getFolder: builder.query({
            query: ({ id, deletedContent }) => {
                return {
                    document: gql`
                          query {
                            courses_Folder${getSelectById(id)} {
                              _id
                              _type
                              courses_name
                              courses_folderContent {
                                _id
                                _type
                                courses_name
                                # https://github.com/matfyz-sk/courses-backend/issues/39
                                # courses_isDeleted${typeof deletedContent === "boolean" ? getNonStringEquals(deletedContent) : ""}
                                courses_isDeleted
                              }
                            }
                          }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                // TODO there has to be a better way, but might need a change on the BE
                const folder = response?.Folder[0]
                return {
                        ...folder,
                        folderContent: syncIdAndTypeOfEntities(folder?.folderContent).filter(
                            entity => entity.isDeleted !== true
                        ),
                } ?? {}
            },
            providesTags: ["Folder"],
        }),
        getDocumentReference: builder.query({
            query: ({ courseInstanceId, documentId }) => ({
                document: gql`
                    query {
                      courses_DocumentReference {
                        _id
                        courses_document${getSelectById(documentId)} {
                            _id
                            courses_name
                        }
                        courses_courseInstance${getSelectById(courseInstanceId)} {
                            _id
                        }
                      }
                   }`,
            }),
            transformResponse: (response, meta, arg) => response.DocumentReference[0],
            providesTags: ["DocumentReference"],
        }),
        getDocument: builder.query({
            query: ({ shortId }) => {
                const internalId = `${DATA_PREFIX}${DocumentEnums.internalDocument.entityName}/${shortId}`
                const externalId = `${DATA_PREFIX}${DocumentEnums.externalDocument.entityName}/${shortId}`
                const fileId = `${DATA_PREFIX}${DocumentEnums.file.entityName}/${shortId}`
                return {
                    document: gql`
                        query {
                          courses_Internaldocument${getSelectById(internalId)} {
                            _id
                            _type
                            courses_name
                            courses_courseInstances {
                                _id
                            }
                            courses_mimeType
                          }
                          courses_Externaldocument${getSelectById(externalId)} {
                            _id
                            _type
                            courses_name
                            courses_uri
                            courses_courseInstances {
                                _id
                            }
                          }
                          courses_File${getSelectById(fileId)} {
                            _id
                            _type
                            courses_name
                            courses_filename
                            courses_courseInstances {
                                _id
                            }
                            courses_mimeType
                          }
                        }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                return response.Internaldocument?.[0] ?? response.Externaldocument?.[0] ?? response.File?.[0]
            },
            providesTags: ["Externaldocument", "Internaldocument", "File"],
        }),
        getExternalDocument: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_Externaldocument${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_uri
                    courses_isDeleted
                    courses_courseInstances {
                      _id
                    }
                    courses_previousVersion {
                      _id
                    }
                    courses_nextVersion {
                      _id
                    }
                    courses_historicVersion {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Externaldocument[0],
            providesTags: ["Externaldocument"],
        }),
        getInternalDocument: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_Internaldocument${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_isDeleted
                    courses_editorContent
                    courses_mimeType
                    courses_courseInstances {
                      _id
                    }
                    courses_previousVersion {
                      _id
                    }
                    courses_nextVersion {
                      _id
                    }
                    courses_historicVersion {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Internaldocument[0],
            providesTags: ["Internaldocument"],
        }),
        getFile: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_File${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_filename
                    courses_rawContent
                    courses_mimeType
                    courses_courseInstances {
                      _id
                    }
                    courses_previousVersion {
                      _id
                    }
                    courses_nextVersion {
                      _id
                    }
                    courses_historicVersion {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File[0],
            providesTags: ["File"],
        }),
        getFileWithoutContent: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_File${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_filename
                    
                    courses_mimeType
                    courses_courseInstances {
                      _id
                    }
                    courses_previousVersion {
                      _id
                    }
                    courses_nextVersion {
                      _id
                    }
                    courses_historicVersion {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File[0],
            providesTags: ["File"],
        }),
        addFolder: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_Folder(
                    courses_name: "${body.name}"
                    courses_courseInstance: "${body.courseInstance}"
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.parent ? `courses_parent: "${body.parent}"` : ""}
                    ${body.folderContent ? `courses_folderContent: ${getArrayFormat(body.folderContent)}` : ""}
                    ${body.lastChanged ? `courses_lastChanged: "${body.lastChanged}"` : ""}
                  ) {
                  _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Folder[0],
            invalidatesTags: ["Folder"],
        }),
        addDocumentReference: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_DocumentReference(
                    courses_document: "${body.document}"
                    courses_courseInstance: "${body.courseInstance}"
                  ) {
                  _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.DocumentReference[0],
            invalidatesTags: ["DocumentReference"],
        }),
        addExternalDocument: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_Externaldocument(
                    courses_name: "${body.name}"
                    courses_uri: "${body.uri}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Externaldocument[0],
            invalidatesTags: ["Externaldocument"],
        }),
        addInternalDocument: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_Internaldocument(
                    courses_name: "${body.name}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    courses_mimeType: "${body.mimeType}"
                    ${body.editorContent ? `courses_editorContent: "${body.editorContent}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Internaldocument[0],
            invalidatesTags: ["Internaldocument"],
        }),
        addFile: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_File(
                    courses_name: "${body.name}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.mimeType ? `courses_mimeType: "${body.mimeType}"` : ""}
                    ${body.filename ? `courses_filename: "${body.filename}"` : ""}
                    ${body.rawContent ? `courses_rawContent: "${body.rawContent}"` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File[0],
            invalidatesTags: ["File"],
        }),
        updateFolder: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_Folder(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.parent ? `courses_parent: "${body.parent}"` : ""}
                    ${body.courseInstance ? `courses_courseInstance: "${body.courseInstance}"` : ""}
                    ${body.folderContent ? `courses_folderContent: ${getArrayFormat(body.folderContent)}` : ""}
                    ${body.lastChanged ? `courses_lastChanged: "${body.lastChanged}"` : ""}
                  ) {
                    _id
                  }
            }`,
            }),
            transformResponse: (response, meta, arg) => response.Folder[0],
            invalidatesTags: ["Folder"],
        }),
        updateDocumentReference: builder.mutation({
            query: ({ id, body }) => ({
                // TODO what about material?
                document: gql`
                mutation {
                  update_courses_DocumentReference(
                    _id: "${id}"
                    courses_document: "${body.document}"
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.DocumentReference[0],
            invalidatesTags: ["DocumentReference"],
        }),
        updateExternalDocument: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_Externaldocument(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.uri ? `courses_uri: "${body.uri}"` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Externaldocument[0],
            invalidatesTags: ["Externaldocument"],
        }),
        updateInternalDocument: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_Internaldocument(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.mimeType ? `courses_mimeType: "${body.mimeType}"` : ""}
                    ${body.editorContent ? `courses_editorContent: "${body.editorContent}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.Internaldocument[0],
            invalidatesTags: ["Internaldocument"],
        }),
        updateFile: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_File(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.filename ? `courses_filename: "${body.filename}"` : ""}
                    ${body.mimeType ? `courses_mimeType: "${body.mimeType}"` : ""}
                    ${body.rawContent ? `courses_rawContent: "${body.rawContent}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${body.previousVersion ? `courses_previousVersion: "${body.previousVersion}"` : ""}
                    ${body.nextVersion ? `courses_nextVersion: "${body.nextVersion}"` : ""}
                    ${body.historicVersion ? `courses_historicVersion: ${getArrayFormat(body.historicVersion)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File[0],
            invalidatesTags: ["File"],
        }),
    }),
})

export const {
    useGetFolderQuery,
    useGetDocumentReferenceQuery,
    useGetDocumentQuery,
    useGetExternalDocumentQuery,
    useGetInternalDocumentQuery,
    useGetFileQuery,
    useGetFileWithoutContentQuery,
    useAddFolderMutation,
    useAddDocumentReferenceMutation,
    useAddExternalDocumentMutation,
    useAddInternalDocumentMutation,
    useAddFileMutation,
    useUpdateFolderMutation,
    useUpdateDocumentReferenceMutation,
    useUpdateExternalDocumentMutation,
    useUpdateInternalDocumentMutation,
    useUpdateFileMutation,
    useGetDeletedDocumentsQuery,
} = documentsGraphApi

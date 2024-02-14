import { createApi } from "@reduxjs/toolkit/query/react"
import { BACKEND_URL } from "../constants"
import { gql } from "graphql-request"
import { getArrayFormat, getNonStringEquals, getSelectById, graphqlBaseQuery } from "./baseQuery"
import { DocumentEnums, getIdByEntityName } from "../pages/documents/common/enums/document-enums"
import { DATA_PREFIX } from "../constants/ontology"

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
    tagTypes: ["Folder", "ExternalDocument", "InternalDocument", "File", "DocumentReference"],
    endpoints: builder => ({
        getDeletedDocuments: builder.query({
            query: ({ courseInstanceId }) => {
                return {
                    document: gql`
                        query {
                          courses_InternalDocument {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_restoredFrom
                            courses_createdAt
                            courses_courseInstances${getSelectById(courseInstanceId)} {
                              _id
                            }
                          }
                          courses_ExternalDocument {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_restoredFrom
                            courses_createdAt
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
                            courses_restoredFrom
                            courses_createdAt
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
                        ...(response.InternalDocument ?? []),
                        ...(response.ExternalDocument ?? []),
                        ...(response.File ?? []),
                    ]
                } catch {
                    return []
                }
                return syncIdAndTypeOfEntities(documents?.filter(entity => entity.isDeleted === true))
            },
            providesTags: ["ExternalDocument", "InternalDocument", "File"],
        }),
        getDocuments: builder.query({
            query: ({ documentIds }) => {
                console.log({ documentIds })
                const internalDocIds = documentIds.filter(id => id.includes(DocumentEnums.internalDocument.entityName))
                const externalDocIds = documentIds.filter(id => id.includes(DocumentEnums.externalDocument.entityName))
                const fileDocIds = documentIds.filter(id => id.includes(DocumentEnums.file.entityName))

                return {
                    document: gql`
                        query {
                          courses_InternalDocument(
                            _id: ${internalDocIds.length > 0 ? getArrayFormat(internalDocIds) : `[null]`}
                          ) {
                            _id
                            _type
                            courses_name
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_mimeType
                            courses_restoredFrom
                            courses_createdAt
                          }
                          courses_ExternalDocument(
                            _id: ${externalDocIds.length > 0 ? getArrayFormat(externalDocIds) : `[null]`}
                          ) {
                            _id
                            _type
                            courses_name
                            courses_uri
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_restoredFrom
                            courses_createdAt
                          }
                          courses_File(
                            _id: ${fileDocIds.length > 0 ? getArrayFormat(fileDocIds) : `[null]`}
                          ) {
                            _id
                            _type
                            courses_name
                            courses_filename
                            # https://github.com/matfyz-sk/courses-backend/issues/39
                            # courses_isDeleted${getNonStringEquals(true)}
                            courses_isDeleted
                            courses_mimeType
                            courses_restoredFrom
                            courses_createdAt
                          }
                        }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                try {
                    const documents = [
                        ...(response.InternalDocument ?? []),
                        ...(response.ExternalDocument ?? []),
                        ...(response.File ?? []),
                    ]

                    return syncIdAndTypeOfEntities(documents.filter(entity => entity.isDeleted !== true))
                } catch (e) {
                    return []
                }
            },
            providesTags: ["ExternalDocument", "InternalDocument", "File"],
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
                              courses_parent {
                                _id
                                courses_name
                              }
                              courses_folderContent {
                                _id
                                _type
                                courses_name
                                # https://github.com/matfyz-sk/courses-backend/issues/39
                                # courses_isDeleted ${
                                    typeof deletedContent === "boolean" ? getNonStringEquals(deletedContent) : ""
                                }
                                courses_isDeleted
                                courses_createdAt
                              }
                            }
                          }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                // TODO there has to be a better way, but might need a change on the BE
                const folder = response?.Folder[0]
                return (
                    {
                        ...folder,
                        folderContent: syncIdAndTypeOfEntities(folder?.folderContent).filter(
                            entity => entity.isDeleted !== true
                        ),
                    } ?? {}
                )
            },
            providesTags: ["Folder", "ExternalDocument", "InternalDocument", "File"],
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
            transformResponse: (response, meta, arg) => response.DocumentReference?.[0],
            providesTags: ["DocumentReference"],
        }),
        getDocumentReferences: builder.query({
            query: ({ documentIds, courseInstanceId }) => ({
                document: gql`
                    query {
                      courses_DocumentReference {
                        _id
                        courses_document(_id: ${getArrayFormat(documentIds)}) {
                            _id
                        }
                        courses_courseInstance${getSelectById(courseInstanceId)} {
                            _id
                        }
                      }
                   }`,
            }),
            transformResponse: (response, meta, arg) => response.DocumentReference,
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
                          courses_InternalDocument${getSelectById(internalId)} {
                            _id
                            _type
                            courses_name
                            courses_mimeType
                            courses_restoredFrom
                            courses_createdAt
                            courses_editorContent
                            courses_isDeleted
                            courses_courseInstances {
                                _id
                            }
                            courses_previousDocumentVersion {
                                _id
                            }
                            courses_nextDocumentVersion {
                                _id
                            }
                            courses_historicDocumentVersions {
                                _id
                            }
                          }
                          courses_ExternalDocument${getSelectById(externalId)} {
                            _id
                            _type
                            courses_name
                            courses_uri
                            courses_restoredFrom
                            courses_createdAt
                            courses_isDeleted
                            courses_courseInstances {
                                _id
                            }
                            courses_previousDocumentVersion {
                                _id
                            }
                            courses_nextDocumentVersion {
                                _id
                            }
                            courses_historicDocumentVersions {
                                _id
                            }
                          }
                          courses_File${getSelectById(fileId)} {
                            _id
                            _type
                            courses_name
                            courses_filename
                            courses_mimeType
                            courses_restoredFrom
                            courses_createdAt
                            courses_rawContent
                            courses_isDeleted
                            courses_courseInstances {
                                _id
                            }
                            courses_previousDocumentVersion {
                                _id
                            }
                            courses_nextDocumentVersion {
                                _id
                            }
                            courses_historicDocumentVersions {
                                _id
                            }
                          }
                        }`,
                }
            },
            transformResponse: (response, meta, arg) => {
                return response.InternalDocument?.[0] ?? response.ExternalDocument?.[0] ?? response.File?.[0]
            },
            providesTags: ["ExternalDocument", "InternalDocument", "File"],
        }),
        getContentOfDocument: builder.query({
            query: ({ id }) => ({
                document: gql`
                    query {
                      courses_File${getSelectById(id)} {
                        _id
                        courses_rawContent
                      }
                      courses_InternalDocument${getSelectById(id)} {
                        _id
                        courses_editorContent
                      }
                    }`,
            }),
            transformResponse: (response, meta, arg) =>
                response?.File?.[0]?.rawContent ?? response?.InternalDocument?.[0]?.editorContent,
            providesTags: ["File", "InternalDocument"],
        }),
        getExternalDocument: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_ExternalDocument${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_uri
                    courses_isDeleted
                    courses_restoredFrom
                    courses_createdAt
                    courses_courseInstances {
                      _id
                    }
                    courses_previousDocumentVersion {
                      _id
                    }
                    courses_nextDocumentVersion {
                      _id
                    }
                    courses_historicDocumentVersions {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.ExternalDocument[0],
            providesTags: ["ExternalDocument"],
        }),
        getInternalDocument: builder.query({
            query: ({ id }) => ({
                document: gql`
                query {
                  courses_InternalDocument${getSelectById(id)} {
                    _id
                    _type
                    courses_name
                    courses_isDeleted
                    courses_editorContent
                    courses_mimeType
                    courses_restoredFrom
                    courses_createdAt
                    courses_courseInstances {
                      _id
                    }
                    courses_previousDocumentVersion {
                      _id
                    }
                    courses_nextDocumentVersion {
                      _id
                    }
                    courses_historicDocumentVersions {
                      _id
                    }
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.InternalDocument[0],
            providesTags: ["InternalDocument"],
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
                    courses_restoredFrom
                    courses_createdAt
                    courses_courseInstances {
                      _id
                    }
                    courses_previousDocumentVersion {
                      _id
                    }
                    courses_nextDocumentVersion {
                      _id
                    }
                    courses_historicDocumentVersions {
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
                    courses_restoredFrom
                    courses_createdAt
                    courses_mimeType
                    courses_courseInstances {
                      _id
                    }
                    courses_previousDocumentVersion {
                      _id
                    }
                    courses_nextDocumentVersion {
                      _id
                    }
                    courses_historicDocumentVersions {
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
            transformResponse: (response, meta, arg) => response.DocumentReference?.[0],
            invalidatesTags: ["DocumentReference"],
        }),
        addExternalDocument: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_ExternalDocument(
                    courses_name: "${body.name}"
                    courses_uri: "${body.uri}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.ExternalDocument?.[0],
            invalidatesTags: ["ExternalDocument"],
        }),
        addInternalDocument: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_InternalDocument(
                    courses_name: "${body.name}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    courses_mimeType: "${body.mimeType}"
                    ${body.editorContent ? `courses_editorContent: "${body.editorContent}"` : ""}
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.InternalDocument?.[0],
            invalidatesTags: ["InternalDocument"],
        }),
        addFile: builder.mutation({
            query: body => ({
                document: gql`
                mutation {
                  insert_courses_File(
                    courses_name: "${body.name}"
                    courses_courseInstances: ${getArrayFormat(body.courseInstances)}
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.mimeType ? `courses_mimeType: "${body.mimeType}"` : ""}
                    ${body.filename ? `courses_filename: "${body.filename}"` : ""}
                    ${body.rawContent ? `courses_rawContent: "${body.rawContent}"` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File?.[0],
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
            transformResponse: (response, meta, arg) => response.Folder?.[0],
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
            transformResponse: (response, meta, arg) => response.DocumentReference?.[0],
            invalidatesTags: ["DocumentReference"],
        }),
        updateExternalDocument: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_ExternalDocument(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.uri ? `courses_uri: "${body.uri}"` : ""}
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.ExternalDocument?.[0],
            invalidatesTags: ["ExternalDocument"],
        }),
        updateInternalDocument: builder.mutation({
            query: ({ id, body }) => ({
                document: gql`
                mutation {
                  update_courses_InternalDocument(
                    _id: "${id}"
                    ${body.name ? `courses_name: "${body.name}"` : ""}
                    ${body.mimeType ? `courses_mimeType: "${body.mimeType}"` : ""}
                    ${body.editorContent ? `courses_editorContent: "${body.editorContent}"` : ""}
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.InternalDocument?.[0],
            invalidatesTags: ["InternalDocument"],
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
                    ${body.restoredFrom ? `courses_restoredFrom: "${body.restoredFrom}"` : ""}
                    ${typeof body.isDeleted === "boolean" ? `courses_isDeleted: ${body.isDeleted}` : ""}
                    ${body.courseInstances ? `courses_courseInstances: ${getArrayFormat(body.courseInstances)}` : ""}
                    ${body.previousDocumentVersion ? `courses_previousDocumentVersion: "${body.previousDocumentVersion}"` : ""}
                    ${body.nextDocumentVersion ? `courses_nextDocumentVersion: "${body.nextDocumentVersion}"` : ""}
                    ${body.historicDocumentVersions ? `courses_historicDocumentVersions: ${getArrayFormat(body.historicDocumentVersions)}` : ""}
                  ) {
                    _id
                  }
                }`,
            }),
            transformResponse: (response, meta, arg) => response.File?.[0],
            invalidatesTags: ["File"],
        }),
    }),
})
export const {
    useGetContentOfDocumentQuery,
    useLazyGetContentOfDocumentQuery,
    useGetDocumentsQuery,
    useGetFolderQuery,
    useLazyGetFolderQuery,
    useGetDocumentReferenceQuery,
    useLazyGetDocumentReferenceQuery,
    useGetDocumentReferencesQuery,
    useGetDocumentQuery,
    useLazyGetDocumentQuery,
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

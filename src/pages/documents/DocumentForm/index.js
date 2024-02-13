import React from "react"
import { withRouter } from "react-router-dom"
import ExternalDocumentForm from "./ExternalDocumentForm"
import { DocumentEnums, getEntityName } from "../common/enums/document-enums"
import {
    useGetDocumentQuery,
    useGetDocumentReferenceQuery,
    useGetFolderQuery,
    useUpdateDocumentReferenceMutation,
    useUpdateFolderMutation,
} from "../../../services/documentsGraph"
import { useGetCourseInstanceQuery, useUpdateCourseInstanceMutation } from "../../../services/course"
import { DATA_PREFIX } from "../../../constants/ontology"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import FileForm from "./FileForm"
import InternalDocumentForm from "./InternalDocumentForm"
import { ThemeProvider } from "@material-ui/core"
import { customTheme } from "../styles"

function DocumentForm({ match, history }) {
    const { document_id: documentId, course_id: courseId } = match.params
    const folderId = history.location?.state?.data?.folderId
    const folderFullId = `${DATA_PREFIX}folder/${folderId}`
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`

    const { data: document, isFetching: isDocumentFetching } = useGetDocumentQuery({ shortId: documentId })
    const { data: folder, isFetching: isFolderFetching } = useGetFolderQuery({ id: folderFullId }, { skip: !folderId })
    const { data: courseInstanceData, isFetching: isCourseInstanceFetching } = useGetCourseInstanceQuery({ id: courseInstanceFullId }, { skip: !courseId })

    const courseInstance = courseInstanceData?.[0] ?? {}

    const entityName = getEntityName(document?._type)
    const documentFullId = `${DATA_PREFIX}${entityName}/${documentId}`
    const { data: documentReference, isFetching: isRefFetching } = useGetDocumentReferenceQuery(
        {
            courseInstanceId: courseInstanceFullId,
            documentId: documentFullId,
        },
        { skip: !documentId }
    )
    const isFetching = isDocumentFetching || isFolderFetching || isCourseInstanceFetching || isRefFetching

    const [updateCourseInstance] = useUpdateCourseInstanceMutation()
    const [updateFolder] = useUpdateFolderMutation()
    const [updateDocumentReference] = useUpdateDocumentReferenceMutation()

    const onEdit = async newDocumentId => {
        updateFolder({
            id: folderFullId,
            body: {
                folderContent: [
                    ...folder?.folderContent.map(item => item._id).filter(_id => _id !== documentFullId) ?? [],
                    newDocumentId,
                ],
            },
        })
        updateDocumentReference({
            id: documentReference._id,
            body: {
                courseInstance: courseInstanceFullId,
                document: newDocumentId,
            },
        })
        updateCourseInstance({
            id: courseInstanceFullId,
            body: {
                hasDocument: [
                    ...courseInstance?.hasDocument.map(item => item._id).filter(_id => _id !== documentFullId) ?? [],
                    newDocumentId,
                ],
            },
        })
        history.push(
            redirect(
                ROUTES.DOCUMENTS_IN_FOLDER,
                [{ key: "course_id", value: courseId }, { key: "folder_id", value: folderId}]
            )
        )
    }
    if (isFetching) return <div></div>

    return (
        <ThemeProvider theme={customTheme}>
            <div style={{ maxWidth: "1100px", margin: "20px auto", padding: 10 }}>
                {entityName === DocumentEnums.externalDocument.entityName && (
                    <ExternalDocumentForm parentFolderId={folderId} handleEdit={onEdit} />
                )}
                {entityName === DocumentEnums.internalDocument.entityName && (
                    <InternalDocumentForm parentFolderId={folderId} handleEdit={onEdit} />
                )}
                {entityName === DocumentEnums.file.entityName && <FileForm parentFolderId={folderId} handleEdit={onEdit} />}
            </div>
        </ThemeProvider>
    )
}

export default withRouter(DocumentForm)

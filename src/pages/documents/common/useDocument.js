import { useState } from "react"
import {
    useAddDocumentMutation,
    useLazyGetDocumentReferenceQuery,
    useLazyGetFolderQuery,
    useUpdateDocumentMutation,
    useUpdateDocumentReferenceMutation,
    useUpdateFolderMutation,
} from "../../../services/documentsGraph"
import { useAddFileMutation } from "../../../services/documents"
import { useLazyGetCourseInstanceQuery, useUpdateCourseInstanceMutation } from "../../../services/course"
import { DocumentEnums } from "./enums/document-enums"

// Encapsulates all the operations needed for a new document version
// - could be made more universal, 0th version is a special case (see CreateDocumentMenu.js)
export default function useDocument() {
    const [error, setError] = useState(null)

    const [getFolder] = useLazyGetFolderQuery()
    const [getCourseInstance] = useLazyGetCourseInstanceQuery()
    const [getDocumentReference] = useLazyGetDocumentReferenceQuery()

    const [addDocument] = useAddDocumentMutation()
    const [updateDocument] = useUpdateDocumentMutation()

    const [updateCourseInstance] = useUpdateCourseInstanceMutation()
    const [updateFolder] = useUpdateFolderMutation()
    const [updateDocumentReference] = useUpdateDocumentReferenceMutation()

    // REST API endpoint (because of the base64 size constraints on GQL)
    const [addFile] = useAddFileMutation()

    const createNextDocumentVersion = async ({ previousVersionId, entityName, body, courseInstanceId }) => {
        try {
            const newDocument = await createBaseVersion({ entityName, body })
            if (!newDocument) {
                setError("Failed to create new document version")
                return
            }
            await replacePreviousVersionWithNext({ previousVersionId, newDocument, courseInstanceId, entityName })
            return newDocument
        } catch (err) {
            setError("There was an error while creating a new document version. Please try again.")
        }
    }

    const replacePreviousVersionWithNext = async ({ previousVersionId, newDocument, courseInstanceId, entityName }) => {
        const folderPartial = await getFolder({ folderContent: [previousVersionId], courseInstanceId }).unwrap()
        const folder = await getFolder({ id: folderPartial._id }).unwrap()

        const courseInstanceData = await getCourseInstance({ id: courseInstanceId }).unwrap()
        const courseInstance = courseInstanceData[0]

        const documentReference = await getDocumentReference({
            courseInstanceId,
            documentId: previousVersionId,
        }).unwrap()

        await updateDocument({
            id: previousVersionId,
            entityName,
            body: { nextDocumentVersion: newDocument._id },
        }).unwrap()

        await updateFolder({
            id: folder._id,
            body: {
                folderContent: [
                    ...folder.folderContent.map(item => item._id).filter(id => id !== previousVersionId),
                    newDocument._id,
                ],
            },
        }).unwrap()

        await updateDocumentReference({
            id: documentReference._id,
            body: {
                document: newDocument._id,
            },
        }).unwrap()

        // TODO drop hasDocument altogether?
        await updateCourseInstance({
            id: courseInstance._id,
            body: {
                hasDocument: [...courseInstance.hasDocument.map(item => item._id), newDocument._id],
            },
        }).unwrap()
    }

    const createBaseVersion = async ({ entityName, body }) => {
        return entityName === DocumentEnums.file.entityName
            ? await addFile(body).unwrap()
            : await addDocument({ entityName, body }).unwrap()
    }

    return { createNextDocumentVersion, isError: error }
}

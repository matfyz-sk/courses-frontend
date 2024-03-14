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

// encapsulates all the operations needed for a new document version
// TODO could be made more universal, 0th version is a special case (see CreateDocumentMenu.js)
export default function useNewDocumentVersion() {
    const [isSuccess, setIsSuccess] = useState(false)
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

    const createNewDocumentVersion = async ({ previousVersionId, entityName, body, courseInstanceId }) => {
        let newDocument
        try {
            // FIXME workaround, see issue: https://github.com/matfyz-sk/courses-backend/issues/46
            const folderPartial = await getFolder({ folderContent: [previousVersionId], courseInstanceId }).unwrap()
            const folder = await getFolder({ id: folderPartial._id }).unwrap()

            const courseInstanceData = await getCourseInstance({ id: courseInstanceId }).unwrap()
            const courseInstance = courseInstanceData[0]

            const documentReference = await getDocumentReference({
                courseInstanceId,
                documentId: previousVersionId,
            }).unwrap()

            // File has to be created via REST API because of the base64 size constraints on GQL
            newDocument =
                entityName === DocumentEnums.file.entityName
                    ? await addFile(body).unwrap()
                    : await addDocument({
                          entityName,
                          body,
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
                    courseInstance: courseInstance._id,
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
        } catch (e) {
            setError(e)
        }
        setIsSuccess(true)
        return newDocument
    }

    return { createNewDocumentVersion, isSuccess, isError: error }
}

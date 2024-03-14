import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import ExternalDocumentForm from "./ExternalDocumentForm"
import { DocumentEnums, getEntityName } from "../common/enums/document-enums"
import { useGetDocumentQuery, useUpdateDocumentMutation } from "../../../services/documentsGraph"
import { DATA_PREFIX } from "../../../constants/ontology"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import FileForm from "./FileForm"
import InternalDocumentForm from "./InternalDocumentForm"
import { Box, Button, ThemeProvider } from "@material-ui/core"
import { customTheme } from "../styles"
import MaterialForm from "../MaterialForm"
import useNewDocumentVersion from "../common/useNewDocumentVersion"
import { Alert } from "@material-ui/lab"
import DocumentToolbar from "./DocumentToolbar"

function DocumentForm({ match, history }) {
    const { document_id: documentId, course_id: courseId } = match.params
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`

    const { data: documentData, error: getDocumentError, isFetching: isDocumentFetching } = useGetDocumentQuery({
        shortId: documentId,
    })
    const [updateDocument, { error: updateDocumentError }] = useUpdateDocumentMutation()
    const entityName = getEntityName(documentData?._type)
    const documentFullId = `${DATA_PREFIX}${entityName}/${documentId}`

    const isFetching = isDocumentFetching
    const isReadOnly = documentData?.isDeleted

    const { createNewDocumentVersion, error: newDocumentVersionError } = useNewDocumentVersion()

    const [error, setError] = useState("")
    const isError = getDocumentError || updateDocumentError || newDocumentVersionError || error

    const [document, setDocument] = useState(documentData)
    const [material, setMaterial] = useState({
        description: "",
        covers: [],
        mentions: [],
        requires: [],
        assumes: [],
        isAlternativeTo: [],
        refersTo: [],
        generalizes: [],
    })

    useEffect(() => {
        if (isError) console.error(isError)
    }, [isError])

    useEffect(() => {
        setDocument(documentData)
    }, [documentData])

    const onMaterialChange = obj => {
        setMaterial({ ...material, ...obj })
    }

    const onDocumentChange = obj => {
        setDocument({ ...document, ...obj })
    }

    const onInvertIsDeleted = async () => {
        try {
            await updateDocument({ id: document._id, body: { isDeleted: !document.isDeleted } }).unwrap()
            history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
        } catch (err) {
            setError(err)
            console.error(err)
        }
    }

    const onEdit = async () => {
        const body = {
            ...document,
            isDeleted: false,
            courseInstances: document.courseInstances.map(item => item._id),
            previousDocumentVersion: document._id,
            historicDocumentVersions: [...document.historicDocumentVersions.map(item => item._id), document._id],
        }

        const newDocument = await createNewDocumentVersion({
            previousVersionId: documentFullId,
            entityName,
            body,
            courseInstanceId: courseInstanceFullId,
        })
        if (!newDocument) {
            return
        }

        history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
    }

    if (isFetching) {
        return null
    }

    return (
        <ThemeProvider theme={customTheme}>
            <Box maxWidth="1100px" margin="20px auto" padding={10}>
                {isError && <Alert severity="error">There has been an error! Check the logs.</Alert>}
                <DocumentToolbar
                    courseId={courseId}
                    documentId={documentId}
                    isDeleted={document?.isDeleted}
                    onInvertIsDeleted={onInvertIsDeleted}
                    enableHistory={isReadOnly || !document?.previousDocumentVersion}
                />
                {entityName === DocumentEnums.externalDocument.entityName && (
                    <ExternalDocumentForm document={document} handleDocumentChange={onDocumentChange} />
                )}
                {entityName === DocumentEnums.internalDocument.entityName && (
                    <InternalDocumentForm document={document} handleDocumentChange={onDocumentChange} />
                )}
                {entityName === DocumentEnums.file.entityName && (
                    <FileForm document={document} handleDocumentChange={onDocumentChange} />
                )}
                <br />
                <MaterialForm material={material} onMaterialChange={onMaterialChange} isReadOnly={isReadOnly} />

                <Box display="flex" alignItems="center" justifyContent="center">
                    <Button
                        style={{ width: "30%", margin: "auto" }}
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isReadOnly}
                        onClick={onEdit}
                    >
                        Save document
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default withRouter(DocumentForm)

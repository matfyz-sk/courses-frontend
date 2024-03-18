import React, { useEffect, useState } from "react"
import { withRouter } from "react-router-dom"
import ExternalDocumentForm from "./ExternalDocumentForm"
import { DocumentEnums, getEntityName } from "../common/enums/document-enums"
import {
    useAddMaterialMutation,
    useDeleteMaterialMutation,
    useGetDocumentQuery,
    useGetDocumentReferenceQuery,
    useGetMaterialQuery,
    useUpdateDocumentMutation,
    useUpdateMaterialMutation,
} from "../../../services/documentsGraph"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import FileForm from "./FileForm"
import InternalDocumentForm from "./InternalDocumentForm"
import { Box, Button, Checkbox, FormControlLabel, ThemeProvider } from "@material-ui/core"
import { customTheme } from "../styles"
import MaterialForm from "../MaterialForm"
import useDocument from "../common/useDocument"
import { Alert } from "@material-ui/lab"
import DocumentToolbar from "./DocumentToolbar"
import { getFullID } from "../../../helperFunctions"

function DocumentForm({ match, history }) {
    const { document_id: documentId, course_id: courseId } = match.params

    const { data: documentData, error: getDocumentError, isFetching: isDocumentFetching } = useGetDocumentQuery({
        shortId: documentId,
    })
    const entityName = getEntityName(documentData?._type)

    const {
        data: documentReference,
        isFetching: isDocumentReferenceFetching,
        isError: isDocumentReferenceError,
    } = useGetDocumentReferenceQuery(
        {
            courseInstanceId: getFullID(courseId, "courseInstance"),
            documentId: getFullID(documentId, entityName),
        },
        { skip: !documentData }
    )
    const { data: fetchedMaterial, isFetching: isMaterialFetching, isError: isMaterialError } = useGetMaterialQuery(
        { documentReferenceId: documentReference?._id },
        { skip: !documentReference }
    )
    const [addMaterial] = useAddMaterialMutation()
    const [updateMaterial] = useUpdateMaterialMutation()
    const [deleteMaterial] = useDeleteMaterialMutation()

    const [updateDocument, { error: updateDocumentError }] = useUpdateDocumentMutation()

    const [isReadOnly, setIsReadOnly] = useState(documentData?.isDeleted)

    const isFetching = isDocumentFetching || isDocumentReferenceFetching || isMaterialFetching

    const { createNextDocumentVersion, error: newDocumentVersionError } = useDocument()

    // :(
    const [error, setError] = useState("")
    const isError =
        getDocumentError ||
        updateDocumentError ||
        newDocumentVersionError ||
        error ||
        isDocumentReferenceError ||
        isMaterialError

    const [document, setDocument] = useState(documentData)
    const [isMaterial, setIsMaterial] = useState(false)
    const [material, setMaterial] = useState({
        description: "",
        covers: [],
        mentions: [],
        requires: [],
        isAlternativeTo: [],
        refersTo: [],
        generalizes: [],
    })

    useEffect(() => {
        if (fetchedMaterial) {
            setMaterial(fetchedMaterial)
            setIsMaterial(true)
        }
    }, [fetchedMaterial])

    useEffect(() => {
        if (isError) console.error(isError)
    }, [isError])

    useEffect(() => {
        if (documentData) {
            setIsReadOnly(documentData.isDeleted)
            setDocument(documentData)
        }
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

    // TODO RTK query makes a refetch right after my mutations -> unnecessary rerender before redirecting to the documents page
    const onSubmit = async () => {
        setIsReadOnly(true)
        const body = {
            ...document,
            isDeleted: false,
            courseInstances: document.courseInstances.map(item => item._id),
            previousDocumentVersion: document._id,
            historicDocumentVersions: [...document.historicDocumentVersions.map(item => item._id), document._id],
        }

        const newDocument = await createNextDocumentVersion({
            previousVersionId: getFullID(documentId, entityName),
            entityName,
            body,
            courseInstanceId: getFullID(courseId, "courseInstance"),
        })
        if (!newDocument) {
            setError("Failed to create new document version")
            setIsReadOnly(false)
            return
        }

        const materialBody = {}
        Object.entries(material)
            .filter(([_, value]) => Array.isArray(value))
            .map(([key, value]) => materialBody[key] = value.map(item => item._id))
        try {
            if (!isMaterial && fetchedMaterial) {
                // the document was already a material but the user no longer wants it to be one (via checkbox)
                await deleteMaterial(fetchedMaterial._id).unwrap()
            } else if (isMaterial && fetchedMaterial) {
                await updateMaterial({ documentReferenceId: fetchedMaterial._id, body: materialBody }).unwrap()
            } else if (isMaterial) {
                await addMaterial({ documentReferenceId: documentReference._id, body: materialBody }).unwrap()
            }
        } catch (err) {
            setError(err)
            console.error(err)
        }
        setIsReadOnly(false)
        history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
    }

    if (isFetching) {
        return (
            <Box maxWidth="1100px" margin="20px auto">
                <Alert color="success" className="empty-message">
                    Loading...
                </Alert>
            </Box>
        )
    }

    return (
        <ThemeProvider theme={customTheme}>
            <Box maxWidth="1100px" margin="20px auto">
                {isError && <Alert severity="error">There has been an error! Check the logs.</Alert>}
                <DocumentToolbar
                    courseId={courseId}
                    documentId={documentId}
                    isDeleted={document?.isDeleted}
                    onInvertIsDeleted={onInvertIsDeleted}
                    enableHistory={isReadOnly || !document?.previousDocumentVersion}
                />
                {entityName === DocumentEnums.externalDocument.entityName && (
                    <ExternalDocumentForm document={document} handleDocumentChange={onDocumentChange} isReadOnly={isReadOnly} />
                )}
                {entityName === DocumentEnums.internalDocument.entityName && (
                    <InternalDocumentForm document={document} handleDocumentChange={onDocumentChange}  />
                )}
                {entityName === DocumentEnums.file.entityName && (
                    <FileForm document={document} handleDocumentChange={onDocumentChange} isReadOnly={isReadOnly} />
                )}
                <br />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isMaterial}
                            color="primary"
                            label={"Make this document a material"}
                            onChange={e => setIsMaterial(e.target.checked)}
                            inputProps={{ "aria-label": "primary checkbox" }}
                        />
                    }
                    label="Make this document a material"
                />

                {isMaterial && (
                    <MaterialForm material={material} onMaterialChange={onMaterialChange} isReadOnly={isReadOnly} />
                )}

                <Box display="flex" alignItems="center" justifyContent="center">
                    <Button
                        style={{ width: "30%", margin: "auto" }}
                        size="large"
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={isReadOnly}
                        onClick={onSubmit}
                    >
                        Save document
                    </Button>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default withRouter(DocumentForm)

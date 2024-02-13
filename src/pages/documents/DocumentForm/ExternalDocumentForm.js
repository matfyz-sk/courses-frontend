import { Button, IconButton, TextField } from "@material-ui/core"
import { customTheme } from "../styles"
import { MdDelete, MdHistory, MdRestorePage } from "react-icons/md"
import { isValidHttpUrl } from "../../../functions/validators"
import { withRouter } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { Alert } from "@material-ui/lab"
import {
    useAddExternalDocumentMutation,
    useGetExternalDocumentQuery,
    useUpdateExternalDocumentMutation,
} from "../../../services/documentsGraph"
import { DATA_PREFIX } from "../../../constants/ontology"
import { DocumentEnums } from "../common/enums/document-enums"
import * as ROUTES from "../../../constants/routes"
import { redirect } from "../../../constants/redirect"

function ExternalDocumentForm({ match, history, handleEdit, parentFolderId }) {
    const { course_id: courseId, document_id: documentId } = match.params
    const documentFullId = `${DATA_PREFIX}${DocumentEnums.externalDocument.entityName}/${documentId}`

    const [updateExternalDocument, {}] = useUpdateExternalDocumentMutation()
    const [addExternalDocument, {}] = useAddExternalDocumentMutation()
    const { data: externalDocument, isFetching } = useGetExternalDocumentQuery(
        { id: documentFullId },
        { skip: !documentId }
    )

    const [name, setName] = useState(externalDocument?.name ?? "")
    const [isDeleted, setIsDeleted] = useState(externalDocument?.isDeleted ?? false)
    const [uri, setUri] = useState(externalDocument?.uri ?? "")
    // const [isMaterial, setIsMaterial] = useState(false)

    const isReadOnly = isDeleted

    useEffect(() => {
        if (externalDocument) {
            setName(externalDocument.name)
            setUri(externalDocument.uri)
            setIsDeleted(externalDocument.isDeleted)
        }
    }, [isFetching])

    const onEdit = async _ => {
        const body = {
            name,
            uri,
            isDeleted: false,
            courseInstances: externalDocument.courseInstances.map(item => item._id),
            previousVersion: externalDocument._id,
            historicVersion: [...externalDocument.historicVersion.map(item => item._id), externalDocument._id],
        }

        try {
            const newExternalDocument = await addExternalDocument(body).unwrap()
            await updateExternalDocument({
                id: externalDocument._id,
                body: { nextVersion: newExternalDocument._id },
            }).unwrap()
            await handleEdit(newExternalDocument._id)
        } catch (e) {
            console.error(e)
        }
    }

    const onInvertIsDeleted = async _ => {
        try {
            await updateExternalDocument({ id: externalDocument._id, body: { isDeleted: !isDeleted } }).unwrap()
            history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
        } catch (err) {
            console.error(err)
        }
    }

    if (isFetching) {
        return (
            <Alert color="success" className="empty-message">
                Loading...
            </Alert>
        )
    }

    return (
        <>
            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "1em",
                    }}
                >
                    <IconButton
                        color="primary"
                        aria-label="history"
                        style={{ outline: "None" }}
                        disabled={isReadOnly || !externalDocument?.previousVersion}
                        onClick={() =>
                            history.push(redirect(ROUTES.DOCUMENT_HISTORY, [{ key: "course_id", value: courseId }]), {
                                documentId,
                                parentFolderId,
                            })
                        }
                    >
                        <MdHistory />
                    </IconButton>
                    <IconButton
                        color="primary"
                        style={{ outline: "None" }}
                        aria-label={isDeleted ? "restore" : "delete"}
                        onClick={onInvertIsDeleted}
                    >
                        {isDeleted ? <MdRestorePage /> : <MdDelete />}
                    </IconButton>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                    error={name.length === 0}
                    id="name-textfield"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                    helperText={name.length === 0 ? "Name is required" : ""}
                    variant="outlined"
                    disabled={isReadOnly}
                />
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <TextField
                    error={!isValidHttpUrl(uri)}
                    id="url-textfield"
                    label="Url"
                    type="url"
                    fullWidth
                    value={uri}
                    onChange={e => setUri(e.target.value)}
                    helperText={!isValidHttpUrl(uri) ? "Valid url is required" : ""}
                    variant="outlined"
                    disabled={isReadOnly}
                />
            </div>
            <br />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
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
            </div>
            {/*<RelocateDialog*/}
            {/*    isOpen={isRelocateDialogOpen}*/}
            {/*    onIsOpenChanged={setIsRelocateDialogOpen}*/}
            {/*    label={"Restore to"}*/}
            {/*    onPaste={handlePaste}*/}
            {/*/>*/}
        </>
    )
}

export default withRouter(ExternalDocumentForm)

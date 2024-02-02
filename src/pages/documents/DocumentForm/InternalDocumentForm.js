import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core"
import { customTheme } from "../styles"
import { MdDelete, MdHistory, MdRestorePage } from "react-icons/md"
import { withRouter } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { Alert } from "@material-ui/lab"
import {
    useAddInternalDocumentMutation,
    useGetInternalDocumentQuery,
    useUpdateInternalDocumentMutation,
} from "../../../services/documentsGraph"
import { DATA_PREFIX } from "../../../constants/ontology"
import { DocumentEnums } from "../common/enums/document-enums"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import CustomEditor from "../CustomEditor"

function InternalDocumentForm({ match, handleEdit }) {
    const { course_id: courseId, document_id: documentId } = match.params
    const documentFullId = `${DATA_PREFIX}${DocumentEnums.internalDocument.entityName}/${documentId}`

    const [updateInternalDocument, {}] = useUpdateInternalDocumentMutation()
    const [addInternalDocument, {}] = useAddInternalDocumentMutation()
    const { data: internalDocument, isFetching } = useGetInternalDocumentQuery(
        { id: documentFullId },
        { skip: !documentId }
    )

    const [name, setName] = useState(internalDocument?.name ?? "")
    const [mimeType, setMimeType] = useState(internalDocument?.mimeType ?? "")
    const [editorContent, setEditorContent] = useState(internalDocument?.editorContent ?? "")

    // const [isMaterial, setIsMaterial] = useState(false)

    // TODO restoration and the related readonly
    const isBeforeMimeTypeChosen = mimeType === ""
    const isDeleted = internalDocument?.isDeleted ?? false
    const isReadOnly = false

    useEffect(() => {
        if (internalDocument) {
            setName(internalDocument?.name ?? "")
            setMimeType(internalDocument?.mimeType ?? "")
            setEditorContent(internalDocument?.editorContent ?? "")
        }
    }, [isFetching])

    const onEdit = async _ => {
        // TODO payload probably in the class

        const body = {
            name,
            mimeType,
            editorContent,
            isDeleted: false,
            courseInstances: internalDocument.courseInstances.map(item => item._id),
            previousVersion: internalDocument._id,
            historicVersion: [...internalDocument.historicVersion.map(item => item._id), internalDocument._id],
        }

        // TODO should i even use try catch
        try {
            const newDocument = await addInternalDocument(body).unwrap()
            updateInternalDocument({
                id: internalDocument._id,
                body: { nextVersion: newDocument._id },
            })
            await handleEdit(newDocument._id)
        } catch (e) {
            console.error(e)
        }
    }

    const onInvertIsDeleted = async _ => {
        updateInternalDocument({ id: internalDocument._id, body: { isDeleted: !isDeleted } })
        history.push(redirect(ROUTES.DOCUMENTS, [{ key: "course_id", value: courseId }]))
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
                {mimeType && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "1em",
                        }}
                    >
                        <IconButton
                        // aria-label="history"
                        // style={{
                        //     outline: "none",
                        //     color: customTheme.palette.primary.main,
                        // }}
                        // onClick={() =>
                        //     history.push(
                        //         redirect(ROUTES.DOCUMENT_HISTORY, [
                        //             {
                        //                 key: "course_id",
                        //                 value: courseId,
                        //             },
                        //         ]),
                        //         // {
                        //         //     documentId: getShortID(document["_id"]),
                        //         //     parentFolderId,
                        //         // }
                        //     )
                        // }
                        >
                            <MdHistory />
                        </IconButton>
                        <IconButton
                            aria-label={isDeleted ? "restore" : "delete"}
                            style={{
                                outline: "none",
                                color: customTheme.palette.primary.main,
                            }}
                            onClick={onInvertIsDeleted}
                        >
                            {isDeleted ? <MdRestorePage /> : <MdDelete />}
                        </IconButton>
                    </div>
                )}
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
            <>
                {!mimeType ? (
                    <>
                        <FormControl variant="outlined" style={{ minWidth: 250 }}>
                            <InputLabel id="format-select-label">Format</InputLabel>
                            <Select
                                labelId="format-select-label"
                                id="format-select"
                                value={mimeType}
                                onChange={e => setMimeType(e.target.value)}
                                label="Format"
                            >
                                <MenuItem value="text/html">Rich (html)</MenuItem>
                                <MenuItem value="text/markdown">Lightweight (Markdown)</MenuItem>
                            </Select>
                            <FormHelperText>Can't change after saving document</FormHelperText>
                        </FormControl>
                        <br />
                        <br />
                        <p style={{ color: "grey" }}>Note: page breaks can be set via the horizontal line button</p>
                    </>
                ) : (
                    <>
                        <CustomEditor
                            content={editorContent}
                            setContent={setEditorContent}
                            mimeType={mimeType}
                            isReadOnly={isReadOnly}
                        />
                        {editorContent.length === 0 && (
                            <p style={{ color: customTheme.palette.error.main }}>Document can't be empty</p>
                        )}
                    </>
                )}
            </>

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

export default withRouter(InternalDocumentForm)

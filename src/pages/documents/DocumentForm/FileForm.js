import { Button, FormHelperText, IconButton, Input, InputLabel, TextField } from "@material-ui/core"
import { customTheme } from "../styles"
import { MdDelete, MdHistory, MdRestorePage } from "react-icons/md"
import { Link, withRouter } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { Alert } from "@material-ui/lab"
import { HiDownload } from "react-icons/hi"
import { fileToBase64, getShortID } from "../../../helperFunctions"
import downloadBase64File from "../common/functions/downloadBase64File"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import { useAddFileMutation, useGetFileQuery, useUpdateFileMutation } from "../../../services/documents"

function FileForm({ match, history, parentFolderId, handleEdit }) {
    const { course_id: courseId, document_id: documentId } = match.params

    const [updateFile] = useUpdateFileMutation()
    // GraphQL would not suffice for base64 conversions because of it's 1MB limit, so I had to use REST with limit 8MB
    const [addFile] = useAddFileMutation()
    const { data: fileData, isFetching } = useGetFileQuery(documentId, { skip: !documentId })
    const file = fileData?.[0]

    const [name, setName] = useState(file?.name ?? "")
    const [filename, setFilename] = useState(file?.filename ?? "")
    const [mimeType, setMimeType] = useState(file?.mimeType ?? "")
    const [rawContent, setRawContent] = useState(file?.rawContent ?? "")
    const [isDeleted, setIsDeleted] = useState(file?.isDeleted ?? false)

    const [filePath, setFilePath] = useState("")

    // const [isMaterial, setIsMaterial] = useState(false)

    const isInEditingMode = documentId !== undefined
    const isReadOnly = isDeleted

    useEffect(() => {
        if (file) {
            setName(file.name ?? "")
            setFilename(file.filename ?? "")
            setMimeType(file.mimeType ?? "")
            setRawContent(file.rawContent ?? "")
            setIsDeleted(file.isDeleted ?? false)
        }
    }, [isFetching])

    const onChangeFile = e => {
        fileToBase64(e.target.files[0]).then(base64Content => {
            setRawContent(base64Content)
        })
        setMimeType(e.target.files[0].type)
        setFilename(e.target.files[0].name)
        setFilePath(e.target.value)
    }

    const onDownloadFile = async e => {
        e.preventDefault()
        downloadBase64File(rawContent, filename, mimeType, window)
    }

    const onEdit = async _ => {
        const body = {
            name,
            filename,
            mimeType,
            rawContent,
            isDeleted: false,
            courseInstances: file?.courseInstances?.map(item => item["@id"]) ?? [],
            previousVersion: file["@id"],
            historicVersion: [...file.historicVersion.map(item => item["@id"]), file["@id"]],
        }
        try {
            const newDocumentId = await addFile(body).unwrap()
            await updateFile({
                id: getShortID(file["@id"]),
                body: { nextVersion: newDocumentId },
            }).unwrap()
            await handleEdit(newDocumentId)
        } catch (e) {
            console.error(e)
        }
    }

    const onInvertIsDeleted = async _ => {
        try {
            await updateFile({ id: getShortID(file["@id"]), body: { isDeleted: !isDeleted } }).unwrap()
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
                {isInEditingMode && (
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
                            disabled={isReadOnly || !file?.previousVersion}
                            onClick={() =>
                                history.push(
                                    redirect(ROUTES.DOCUMENT_HISTORY, [{ key: "course_id", value: courseId }]),
                                    {
                                        documentId,
                                        parentFolderId,
                                    }
                                )
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
            <Input
                error={filename.length === 0}
                id="upload-button-file"
                type="file"
                style={{ display: "none" }}
                aria-describedby="file-upload-helper-text"
                value={filePath}
                onChange={onChangeFile}
                disabled={isReadOnly}
            />
            <InputLabel style={{ display: "inline" }} htmlFor="upload-button-file">
                <Button disabled={isReadOnly} variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </InputLabel>
            <span style={{ marginLeft: "3em" }}>{filename.length === 0 ? "No file chosen" : filename}</span>

            {filename.length === 0 ? (
                <FormHelperText id="file-upload-helper-text" error={filename.length === 0}>
                    {filename.length === 0 ? "A file has to be chosen" : ""}
                </FormHelperText>
            ) : (
                <Link style={{ marginLeft: "1.5em" }} id="file-download" to={{}} onClick={onDownloadFile}>
                    {mimeType.startsWith("image") ? (
                        <img
                            style={{ display: "inline", maxWidth: "150px" }}
                            src={rawContent}
                            alt="image of document"
                        />
                    ) : (
                        <HiDownload
                            style={{
                                fontSize: "400%",
                                color: customTheme.palette.primary.main,
                            }}
                        />
                    )}
                </Link>
            )}
            <br />
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
            {/*<Re  locateDialog*/}
            {/*    isOpen={isRelocateDialogOpen}*/}
            {/*    onIsOpenChanged={setIsRelocateDialogOpen}*/}
            {/*    label={"Restore to"}*/}
            {/*    onPaste={handlePaste}*/}
            {/*/>*/}
        </>
    )
}

export default withRouter(FileForm)

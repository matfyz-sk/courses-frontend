import { Box, Button, FormHelperText, Input, InputLabel, TextField } from "@material-ui/core"
import { customTheme } from "../styles"
import { Link, withRouter } from "react-router-dom"
import React, { useState } from "react"
import { Alert } from "@material-ui/lab"
import { HiDownload } from "react-icons/hi"
import { fileToBase64 } from "../../../helperFunctions"
import downloadBase64File from "../common/functions/downloadBase64File"

const MAX_FILE_SIZE = 8 * 1024 * 1024
const MAX_FILE_SIZE_BEFORE_BASE64 = 3 * (MAX_FILE_SIZE / 4)

function FileForm({ document, handleDocumentChange }) {
    const { name, filename, mimeType, rawContent, isDeleted } = document ?? {}
    const [filePath, setFilePath] = useState("")
    const [error, setError] = useState("")
    const isReadOnly = isDeleted

    const onChangeFile = e => {
        e.persist()
        fileToBase64(e.target.files[0]).then(base64Content => {
            const size = new Blob([base64Content]).size
            console.log({ size })
            if (size > MAX_FILE_SIZE) {
                setError(`File size is too big (max size is ${MAX_FILE_SIZE_BEFORE_BASE64} B)`)
                setFilePath("")
            } else {
                setError("")
                handleDocumentChange({
                    rawContent: base64Content,
                    mimeType: e.target.files[0].type,
                    filename: e.target.files[0].name,
                })
            }
        })
        setFilePath(e.target.value)
    }

    const onDownloadFile = async e => {
        e.preventDefault()
        downloadBase64File(rawContent, filename, mimeType, window)
    }

    if (!document) {
        return (
            <Alert color="success" className="empty-message">
                Loading...
            </Alert>
        )
    }

    return (
        <>
            <Box display="flex" justifyContent="center">
                <TextField
                    error={name.length === 0}
                    id="name-textfield"
                    label="Name"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => handleDocumentChange({ name: e.target.value })}
                    helperText={name.length === 0 ? "Name is required" : ""}
                    variant="outlined"
                    disabled={isReadOnly}
                />
            </Box>
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

            {error || filename.length === 0 ? (
                <FormHelperText id="file-upload-helper-text" error={!!error}>
                    Please choose a file
                    <br />
                    {error}
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
        </>
    )
}

export default withRouter(FileForm)

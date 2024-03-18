import { Box, Button, FormHelperText, Input, InputLabel, TextField } from "@material-ui/core"
import { Link, withRouter } from "react-router-dom"
import React, { useEffect, useState } from "react"
import { fileToBase64 } from "../../../helperFunctions"
import downloadBase64File from "../common/functions/downloadBase64File"

const MAX_FILE_SIZE = 8 * 1024 * 1024
const MAX_FILE_SIZE_BEFORE_BASE64 = 3 * (MAX_FILE_SIZE / 4)

function FileForm({ document, handleDocumentChange, isReadOnly }) {
    const { name, filename, mimeType, rawContent } = document ?? {}
    const [file, setFile] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!file) return
        if (file.size > MAX_FILE_SIZE_BEFORE_BASE64) {
            setError(`File size is too big (max size is ${MAX_FILE_SIZE_BEFORE_BASE64} B)`)
            return
        }
        setError("")
        fileToBase64(file)
            .then(base64Content =>
                handleDocumentChange({
                    rawContent: base64Content,
                    mimeType: file.type,
                    filename: file.name,
                })
            )
            .catch(() => setError("Error while reading file"))
    }, [file])


    const onDownloadFile = async e => {
        e.preventDefault()
        downloadBase64File(rawContent, filename, mimeType, window)
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
                onChange={e => setFile(e.target.files[0])}
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
                    {file ? file.name : filename}
                </Link>
            )}
        </>
    )
}

export default withRouter(FileForm)

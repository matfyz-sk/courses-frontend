import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@material-ui/core"
import { customTheme } from "../styles"
import { withRouter } from "react-router-dom"
import React from "react"
import { Alert } from "@material-ui/lab"
import CustomEditor from "../CustomEditor"

// Todo This also works with images encoded with base 64...
function InternalDocumentForm({ document, handleDocumentChange }) {
    const { name, mimeType, editorContent, isDeleted } = document ?? {}
    const isReadOnly = isDeleted

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
            <>
                {!mimeType ? (
                    <>
                        <FormControl variant="outlined" style={{ minWidth: 250 }}>
                            <InputLabel id="format-select-label">Format</InputLabel>
                            <Select
                                labelId="format-select-label"
                                id="format-select"
                                value={mimeType}
                                onChange={e => handleDocumentChange({ mimeType: e.target.value })}
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
                            setContent={data => handleDocumentChange({ editorContent: data })}
                            mimeType={mimeType}
                            isReadOnly={isReadOnly}
                        />
                        {editorContent.length === 0 && (
                            <p style={{ color: customTheme.palette.error.main }}>Document can't be empty</p>
                        )}
                    </>
                )}
            </>
        </>
    )
}

export default withRouter(InternalDocumentForm)

import { Box, TextField } from "@material-ui/core"
import { isValidHttpUrl } from "../../../functions/validators"
import { withRouter } from "react-router-dom"
import React from "react"
import { Alert } from "@material-ui/lab"

function ExternalDocumentForm({ document, handleDocumentChange, isReadOnly }) {
    const { name, uri } = document ?? {}

    return (
        <>
            <Box>
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
                <Box display="flex" justifyContent="center">
                    <TextField
                        error={!isValidHttpUrl(uri)}
                        id="url-textfield"
                        label="Url"
                        type="url"
                        fullWidth
                        value={uri}
                        onChange={e => handleDocumentChange({ uri: e.target.value })}
                        helperText={!isValidHttpUrl(uri) ? "Valid url is required" : ""}
                        variant="outlined"
                        disabled={isReadOnly}
                    />
                </Box>
            </Box>
        </>
    )
}

export default withRouter(ExternalDocumentForm)

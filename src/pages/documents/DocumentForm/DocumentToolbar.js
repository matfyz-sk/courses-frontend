import { Box, IconButton } from "@material-ui/core"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import { MdDelete, MdHistory, MdRestorePage } from "react-icons/md"
import React from "react"
import { withRouter } from "react-router-dom"

function DocumentToolbar({ courseId, documentId, isDeleted, onInvertIsDeleted, enableHistory, history }) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" marginBottom="1em">
            <IconButton
                color="primary"
                aria-label="history"
                disabled={enableHistory}
                onClick={() =>
                    history.push(
                        redirect(ROUTES.DOCUMENT_HISTORY, [
                            { key: "course_id", value: courseId },
                            { key: "document_id", value: documentId },
                        ])
                    )
                }
            >
                <MdHistory />
            </IconButton>
            <IconButton color="primary" aria-label={isDeleted ? "restore" : "delete"} onClick={onInvertIsDeleted}>
                {isDeleted ? <MdRestorePage /> : <MdDelete />}
            </IconButton>
        </Box>
    )
}

export default withRouter(DocumentToolbar)

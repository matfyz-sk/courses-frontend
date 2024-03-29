import React, { useEffect, useRef, useState } from "react"
import { axiosGetEntities, getResponseBody, getShortID, getShortType } from "../../../helperFunctions"
import { DocumentEnums } from "./enums/document-enums"
import { Dialog, DialogContent, DialogTitle, LinearProgress } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import FileExplorer from "../FileExplorer"
import { makeStyles } from "@material-ui/styles"
import { customTheme } from "../styles"
import { withRouter } from "react-router"
import { connect } from "react-redux"

// dialog's intended behaviour is to reset the styling theme so this is a workaround for the progress bar
const useStyles = makeStyles(() => ({
    root: {
        "& .MuiLinearProgress-colorPrimary": {
            backgroundColor: customTheme.palette.primary.main,
        },
        "& .MuiLinearProgress-barColorPrimary": {
            backgroundColor: "#9ecaab",
        },
    },
}))

function RelocateDialog({ label, match, isOpen, onIsOpenChanged, courseInstance, onPaste }) {
    const classes = useStyles()
    const courseId = match.params.course_id

    const [fsPath, setFsPath] = useState([])
    const [fsObjects, setFsObjects] = useState([])
    const [folderId, setFolderId] = useState("")
    const [status, setStatus] = useState(200)
    const [loading, setLoading] = useState(false)

    const dialogRef = useRef()

    useEffect(() => {
        if (courseInstance) {
            setFolderId(getShortID(courseInstance.fileExplorerRoot[0]["_id"]))
            setFsObjects([])
            setFsPath([])
        }
    }, [courseInstance, isOpen])

    useEffect(() => {
        if (folderId === "") return
        setLoading(true)
        const entitiesUrl = `folder/${folderId}?_chain=parent&_join=content`

        axiosGetEntities(entitiesUrl).then(response => {
            setStatus(response.response ? response.response.status : 500)
            if (response.failed) {
                console.error("Couldn't fetch files, try again")
                setLoading(false)
                return
            }
            const data = getResponseBody(response)

            const fsObjects = data[0].content
            setFsObjects(fsObjects.filter(doc => doc.isDeleted === false))
            setLoading(false)
            setFsPath(data.slice().reverse())
        })
    }, [courseId, folderId, isOpen])

    const onFsObjectRowClick = (_, fsObject) => {
        const fileEntity = getShortType(fsObject["@type"])
        if (DocumentEnums.folder.entityName === fileEntity) {
            setFolderId(getShortID(fsObject["_id"]))
            dialogRef.current.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const onPathFolderClick = folderId => {
        setFolderId(folderId)
    }

    const handlePaste = (_, pastingToFolder) => {
        onPaste(pastingToFolder)
    }

    return (
        <Dialog
            open={isOpen}
            onClose={_ => onIsOpenChanged(false)}
            aria-labelledby="referencer-dialog-title"
            maxWidth="md"
            fullWidth
            style={{ padding: "8px 12px" }}
        >
            <DialogTitle id="referencer-dialog-title" aria-label="add document">
                {label}
            </DialogTitle>
            <DialogContent ref={dialogRef}>
                {status !== 200 && <Alert severity="warning">Something has gone wrong!</Alert>}
                <div className={classes.root}>
                    <LinearProgress
                        style={{
                            visibility: loading ? "visible" : "hidden",
                            width: "100%",
                        }}
                    />
                </div>
                <FileExplorer
                    files={fsObjects}
                    // fsPath={fsPath}
                    onRowClickHandler={onFsObjectRowClick}
                    onPathFolderClickHandler={onPathFolderClick}
                    onPaste={handlePaste}
                    isRelocator
                />
            </DialogContent>
        </Dialog>
    )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
    return {
        courseInstance: courseInstanceReducer.courseInstance,
    }
}

export default withRouter(connect(mapStateToProps, {})(RelocateDialog))

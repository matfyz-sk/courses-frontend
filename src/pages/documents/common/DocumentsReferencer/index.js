import React, { useEffect, useRef, useState } from "react"
import FileExplorer from "../../FileExplorer"
import { DocumentEnums, getEntityName } from "../enums/document-enums"
import { withRouter } from "react-router"
import { Dialog, DialogContent, DialogTitle, LinearProgress } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import DocumentsList from "./DocumentsList"
import { makeStyles } from "@material-ui/styles"
import { customTheme } from "../../styles"
import { useGetCourseInstanceQuery } from "../../../../services/course"
import {
    useGetDocumentsQuery,
    useLazyGetDocumentReferenceQuery,
    useLazyGetFolderQuery,
} from "../../../../services/documentsGraph"
import { DATA_PREFIX } from "../../../../constants/ontology"

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

// kinda tightly coupled 🥲
function DocumentReferencer({ label, documentReferences, onDocumentReferencesChange, match, isReadOnly }) {
    const classes = useStyles()
    const courseId = match.params.course_id
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`

    const [getFolder, { data: folder, isUninitialized: folderForExplorerIsUninitialized }] = useLazyGetFolderQuery()
    const fsObjects = folder?.folderContent ?? []
    const { data: courseInstanceData } = useGetCourseInstanceQuery({ id: courseInstanceFullId })
    const courseInstance = courseInstanceData?.[0]

    const [fsPath, setFsPath] = useState([])
    const [status, setStatus] = useState(200)
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const dialogRef = useRef()

    const { data: chosenDocuments } = useGetDocumentsQuery({
        documentIds: documentReferences.map(ref => ref.document._id),
    })
    const [getLazyDocRef] = useLazyGetDocumentReferenceQuery()

    useEffect(() => {
        if (courseInstance) {
            getFolder({ id: courseInstance.fileExplorerRoot._id })
        }
    }, [folderForExplorerIsUninitialized, courseInstance])

    const addToDocuments = async document => {
        const documentRef = await getLazyDocRef({
            documentId: document._id,
            courseInstanceId: courseInstance._id,
        }).unwrap()
        onDocumentReferencesChange([
            ...documentReferences.filter(ref => ref._id !== documentRef._id),
            { _id: documentRef._id, document, courseInstance },
        ])
    }

    const removeFromDocuments = document => {
        onDocumentReferencesChange(documentReferences.filter(docRef => docRef.document._id !== document._id))
    }

    const onFsObjectRowClick = (_, fsObject) => {
        if (DocumentEnums.folder.entityName === getEntityName(fsObject._type)) {
            getFolder({ id: fsObject._id })
            dialogRef.current.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
        addToDocuments(fsObject).then(() => setOpen(false))
    }

    return (
        <>
            <DocumentsList
                title={label}
                toggleSelection={() => setOpen(true)}
                documents={chosenDocuments}
                onRemoveHandler={removeFromDocuments}
                isReadOnly={isReadOnly}
            />
            <Dialog
                open={open}
                onClose={_ => setOpen(false)}
                aria-labelledby="referencer-dialog-title"
                maxWidth="md"
                fullWidth
                style={{ padding: "8px 12px" }}
            >
                <DialogTitle id="referencer-dialog-title" aria-label="add document">
                    Choose document to add
                </DialogTitle>
                <DialogContent ref={dialogRef}>
                    {status !== 200 && (
                        <Alert severity="warning">
                            Couldn't fetch files. You might need to initialize the file system in the documents section
                        </Alert>
                    )}
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
                        folder={folder}
                        onRowClickHandler={onFsObjectRowClick}
                        onPathFolderClickHandler={folderFullId => getFolder({ id: folderFullId })}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default withRouter(DocumentReferencer)

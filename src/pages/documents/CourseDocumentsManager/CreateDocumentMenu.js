import React, { useState } from "react"
import { withRouter } from "react-router"
import { Button, ListItemIcon, Menu, MenuItem } from "@material-ui/core"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import { MdAttachFile, MdCode, MdFolder, MdLink } from "react-icons/md"
import { ThemeProvider, withStyles } from "@material-ui/styles"
import { customTheme } from "../styles"
import { DATA_PREFIX } from "../../../constants/ontology"
import {
    useAddDocumentReferenceMutation,
    useAddExternalDocumentMutation,
    useAddFileMutation,
    useAddInternalDocumentMutation,
    useGetFolderQuery,
    useUpdateFolderMutation,
} from "../../../services/documentsGraph"
import { useGetCourseInstanceQuery, useUpdateCourseInstanceMutation } from "../../../services/course"
import { DocumentEnums } from "../common/enums/document-enums"
import { getShortID } from "../../../helperFunctions"

const CustomListItemIcon = withStyles({
    root: {
        minWidth: "30px",
        color: customTheme.palette.primary.main,
    },
})(ListItemIcon)

function CreateDocumentMenu({ onFolderCreate, loading, match, history }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const courseId = match.params.course_id
    const folderId = match.params.folder_id
    const folderFullId = `${DATA_PREFIX}folder/${folderId}`
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`
    const { data: courseInstanceData, isFetching } = useGetCourseInstanceQuery(courseInstanceFullId, {
        skip: !courseId,
    })

    const courseInstance = courseInstanceData?.[0]
    const { data: folder } = useGetFolderQuery({ id: folderFullId }, { skip: !folderId })

    const [addInternalDocument] = useAddInternalDocumentMutation()
    const [addExternalDocument] = useAddExternalDocumentMutation()
    const [addFile] = useAddFileMutation()
    const [addDocumentReference] = useAddDocumentReferenceMutation()
    const [updateFolder] = useUpdateFolderMutation()
    const [updateCourseInstance] = useUpdateCourseInstanceMutation()

    const handleClick = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = async entityName => {
        setAnchorEl(null)

        let result = null
        let sharedData = {
            name: "New Document",
            courseInstances: [courseInstanceFullId],
            isDeleted: false,
        }

        if (entityName === DocumentEnums.internalDocument.entityName) {
            result = await addInternalDocument({ ...sharedData, mimeType: "", editorContent: "" }).unwrap()
        } else if (entityName === DocumentEnums.externalDocument.entityName) {
            result = await addExternalDocument({ ...sharedData, uri: "" }).unwrap()
        } else if (entityName === DocumentEnums.file.entityName) {
            result = await addFile({ ...sharedData, filename: "", mimeType: "", rawContent: "" }).unwrap()
        }

        if (result === null) return

        try {
            updateFolder({
                id: folderFullId,
                body: {
                    folderContent: [...folder.folderContent.map(item => item._id), result._id],
                },
            })
            const refResult = await addDocumentReference({
                courseInstance: courseInstanceFullId,
                document: result._id,
            }).unwrap()
            updateCourseInstance({
                id: courseInstanceFullId,
                body: {
                    hasDocument: [...courseInstance.hasDocument.map(item => item._id), result._id],
                    documentReference: [...courseInstance.documentReference.map(item => item._id), refResult._id],
                },
            })

            history.push(
                redirect(ROUTES.EDIT_DOCUMENT, [
                    { key: "course_id", value: courseId },
                    { key: "document_id", value: getShortID(result._id) },
                ]),
                { data: { folderId } }
            )
        } catch (err) {
            console.log(err)
        }
    }

    if (isFetching) return null

    return (
        <ThemeProvider theme={customTheme}>
            <Button
                style={{ outline: "none" }}
                variant="contained"
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
                color="primary"
                disabled={loading}
            >
                CREATE
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem
                    onClick={() => {
                        setAnchorEl(null)
                        onFolderCreate()
                    }}
                >
                    <CustomListItemIcon>
                        <MdFolder />
                    </CustomListItemIcon>
                    Folder
                </MenuItem>
                <MenuItem onClick={() => handleClose(DocumentEnums.internalDocument.entityName)}>
                    <CustomListItemIcon>
                        <MdCode />
                    </CustomListItemIcon>
                    Internal
                </MenuItem>
                <MenuItem onClick={() => handleClose(DocumentEnums.externalDocument.entityName)}>
                    <CustomListItemIcon>
                        <MdLink />
                    </CustomListItemIcon>
                    External
                </MenuItem>
                <MenuItem onClick={() => handleClose(DocumentEnums.file.entityName)}>
                    <CustomListItemIcon>
                        <MdAttachFile />
                    </CustomListItemIcon>
                    File
                </MenuItem>
            </Menu>
        </ThemeProvider>
    )
}

export default withRouter(CreateDocumentMenu)

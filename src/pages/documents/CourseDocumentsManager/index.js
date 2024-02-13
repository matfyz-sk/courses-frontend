import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { Alert } from "@material-ui/lab"
import { Button, IconButton, LinearProgress, TextField, ThemeProvider, useMediaQuery } from "@material-ui/core"
import { getShortID, getShortType } from "../../../helperFunctions"
import { redirect } from "../../../constants/redirect"
import * as ROUTES from "../../../constants/routes"
import { DATA_PREFIX } from "../../../constants/ontology"
import { setClipboardBeingCut, setClipboardOldParent, setFolder } from "../../../redux/actions"
import FileExplorer from "../FileExplorer"
import { DocumentEnums } from "../common/enums/document-enums"
import { customTheme } from "../styles"
import FolderDialog from "./FolderDialog"
import CreateDocumentMenu from "./CreateDocumentMenu"
import { MdDelete } from "react-icons/md"
import { TiArrowBack } from "react-icons/ti"
import {
    useAddFolderMutation,
    useGetDeletedDocumentsQuery,
    useGetFolderQuery,
    useUpdateFolderMutation,
} from "../../../services/documentsGraph"
import { useGetFolderParentChainQuery } from "../../../services/documents"

function CourseDocumentManager(props) {
    const {
        match,
        showingDeleted,
        // setFolder,
        history,
        user,
        setClipboardBeingCut,
        setClipboardOldParent,
        clipboard,
    } = props
    const isMobile = useMediaQuery("(max-width:600px)")

    const { course_id: courseId, folder_id: folderId } = match.params

    // folder create and edit
    const [dialogOpen, setDialogOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [isFolderEdit, setIsFolderEdit] = useState(false)
    const [editFolderId, setEditFolderId] = useState(null)

    const {
        data: deletedDocuments,
        isLoading: isDeletedLoading,
        isError: isDeletedError,
    } = useGetDeletedDocumentsQuery(
        { courseInstanceId: `${DATA_PREFIX}courseInstance/${courseId}` },
        { skip: !courseId }
    )
    const { data: folder, isFetching: isFolderFetching, isError: isFolderError } = useGetFolderQuery(
        { id: `${DATA_PREFIX}folder/${folderId}`, deletedContent: false },
        { skip: !folderId }
    )

    const [addFolder, { isError: isAddError }] = useAddFolderMutation()
    const [updateFolder, { isError: isUpdateError }] = useUpdateFolderMutation()

    const isLoading = isFolderFetching || isDeletedLoading
    const isError = isFolderError || isDeletedError || isAddError || isUpdateError
    const fsObjects = (showingDeleted ? deletedDocuments : folder?.folderContent?.filter(item => !item.isDeleted)) ?? []

    const [search, setSearch] = useState("")

    // for relocate function
    // const [isRelocateDialogOpen, setIsRelocateDialogOpen] = useState(false)

    const onFsObjectRowClick = (_, fsObject) => {
        if (DocumentEnums.folder.entityName === getShortType(fsObject._type)) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            history.push(
                redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
                    { key: "course_id", value: courseId },
                    { key: "folder_id", value: getShortID(fsObject._id) },
                ])
            )
            return
        }
        history.push(
            redirect(ROUTES.EDIT_DOCUMENT, [
                { key: "course_id", value: courseId },
                { key: "document_id", value: getShortID(fsObject._id) },
            ]),
            { data: { folderId: getShortID(folder._id) } }
        )
    }

    const createFolder = async () => {
        toggleFolderDialog()
        let data = {
            name: folderName,
            isDeleted: false,
            courseInstance: `${DATA_PREFIX}courseInstance/${courseId}`,
            parent: folder?._id
        }

        const addResponse = await addFolder(data).unwrap()
        try {
            const updateData = {
                folderContent: [...fsObjects.map(doc => doc._id), addResponse._id],
                lastChanged: new Date().getMilliseconds(),
            }
            await updateFolder({ id: `${DATA_PREFIX}folder/${folderId}`, body: updateData }).unwrap()
        } catch (err) {
            console.log(err)
        }
    }

    const handleFolderCreate = () => {
        toggleFolderDialog()
        setIsFolderEdit(false)
    }

    const beginFolderEdit = folder => {
        toggleFolderDialog()
        setFolderName(folder.name)
        setEditFolderId(getShortID(folder._id))
        setIsFolderEdit(true)
    }

    const editFolder = async () => {
        toggleFolderDialog()
        const data = { name: folderName, lastChanged: new Date().getMilliseconds() }
        const parentFolderData = { lastChanged: new Date().getMilliseconds() }
        updateFolder({ id: `${DATA_PREFIX}folder/${editFolderId}`, body: data })
        updateFolder({ id: `${DATA_PREFIX}folder/${folderId}`, body: parentFolderData })
    }
    const toggleFolderDialog = () => {
        setDialogOpen(prev => !prev)
        setFolderName("")
    }

    const onPathFolderClick = folderFullId => {
        history.push(
            redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
                { key: "course_id", value: courseId },
                { key: "folder_id", value: getShortID(folderFullId) },
            ])
        )
    }

    // const handleFsObjectCut = fsObject => {
    //   setClipboardBeingCut(fsObject)
    //   setClipboardOldParent(folder)
    //   setIsRelocateDialogOpen(true)
    // }

    // const handlePaste = (pastingToFolder) => {
    //   setLoading(true)
    //   changeParent(
    //     clipboard.beingCut,
    //     pastingToFolder._id,
    //     clipboard.oldParent._id
    //   ).then(() => {
    //     setIsRelocateDialogOpen(false)
    //     setLoading(false)
    //   })
    // }

    return (
        <ThemeProvider theme={customTheme}>
            <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
                <br />
                {isError && (
                    <>
                        <Alert severity="warning">There has been a server error, try again please!</Alert>
                        <br />
                    </>
                )}
                {!showingDeleted && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <CreateDocumentMenu
                            style={{ display: "inline-block", float: "left" }}
                            onFolderCreate={handleFolderCreate}
                            loading={isLoading}
                        />
                        <Button
                            style={{ outline: "none", float: "right" }}
                            variant="contained"
                            disabled={isLoading}
                            onClick={() =>
                                history.push(
                                    redirect(ROUTES.DELETED_DOCUMENTS, [{ key: "course_id", value: courseId }])
                                )
                            }
                            startIcon={<MdDelete />}
                        >
                            Deleted documents
                        </Button>
                    </div>
                )}
                <br />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <TextField
                        style={{ width: isMobile ? "100%" : "35%" }}
                        id="search-textfield"
                        label="Search in course"
                        type="text"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {showingDeleted && (
                        <IconButton
                            style={{
                                marginLeft: "auto",
                                outline: "none",
                            }}
                            variant="contained"
                            onClick={() =>
                                history.push(
                                    redirect(ROUTES.DOCUMENTS, [
                                        {
                                            key: "course_id",
                                            value: courseId,
                                        },
                                    ])
                                )
                            }
                        >
                            <TiArrowBack />
                        </IconButton>
                    )}
                </div>
                <br />
                <br />
                <LinearProgress style={{ visibility: isLoading ? "visible" : "hidden" }} />
                <FileExplorer
                    files={fsObjects}
                    search={search}
                    folder={folder}
                    onRowClickHandler={onFsObjectRowClick}
                    onPathFolderClickHandler={onPathFolderClick}
                    onCut={() => {}}
                    loading={isLoading}
                    editFolder={beginFolderEdit}
                    hasActionColumn={!showingDeleted}
                />
            </div>
            <FolderDialog
                open={dialogOpen}
                handleClose={toggleFolderDialog}
                folderName={folderName}
                setFolderName={setFolderName}
                onCreate={createFolder}
                onEdit={editFolder}
                isEdit={isFolderEdit}
            />
            {/*<RelocateDialog*/}
            {/*  isOpen={isRelocateDialogOpen}*/}
            {/*  onIsOpenChanged={setIsRelocateDialogOpen}*/}
            {/*  label={'Move to'}*/}
            {/*  onPaste={handlePaste}*/}
            {/*/>*/}
        </ThemeProvider>
    )
}

const mapStateToProps = ({ authReducer, clipboardReducer }) => {
    return {
        clipboard: { ...clipboardReducer },
        user: authReducer.user,
    }
}

export default withRouter(
    connect(mapStateToProps, { setFolder, setClipboardBeingCut, setClipboardOldParent })(CourseDocumentManager)
)

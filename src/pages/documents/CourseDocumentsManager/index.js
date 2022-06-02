import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert } from '@material-ui/lab'
import {
  Button, IconButton,
  LinearProgress,
  TextField,
  ThemeProvider,
  useMediaQuery,
} from '@material-ui/core'
import {
  axiosAddEntity,
  axiosGetEntities,
  axiosUpdateEntity,
  getIRIFromAddResponse,
  getResponseBody,
  getShortID,
  getShortType,
} from '../../../helperFunctions'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import Page404 from '../../errors/Page404'
import {
  setClipboardBeingCut,
  setClipboardOldParent,
  setFolder,
} from '../../../redux/actions'
import FileExplorer from '../FileExplorer'
import { DocumentEnums } from '../common/enums/document-enums'
import { customTheme } from '../styles'
import FolderDialog from './FolderDialog'
import CreateDocumentMenu from './CreateDocumentMenu'
import { MdDelete } from 'react-icons/md'
import { TiArrowBack } from 'react-icons/ti'
import getDeletedDocuments from '../common/functions/getDeletedDocuments'
import RelocateDialog from '../common/RelocateDialog'
import { changeParent } from "../common/functions/changeParent";

function CourseDocumentManager(props) {
  const {
    courseInstance,
    folder,
    match,
    showingDeleted,
    setFolder,
    history,
    user,
    setClipboardBeingCut,
    setClipboardOldParent,
    clipboard
  } = props
  const [renderHack, setRenderHack] = useState(0)
  const isMobile = useMediaQuery('(max-width:600px)')

  const folderId = match.params.folder_id
  const courseId = match.params.course_id

  // folder create and edit
  const [dialogOpen, setDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [isFolderEdit, setIsFolderEdit] = useState(false)
  const [editFolderId, setEditFolderId] = useState(null)

  const [fsPath, setFsPath] = useState([])
  const [fsObjects, setFsObjects] = useState([])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(200)
  const [loading, setLoading] = useState(true)

  // for relocate function
  const [isRelocateDialogOpen, setIsRelocateDialogOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setSearch('')
    setFsObjects([])
    if (showingDeleted) {
      getDeletedDocuments(courseId).then(deleted => {
        setLoading(false)
        setFsObjects(deleted)
        setFsPath([{ name: 'Deleted documents', "@id": 'deleted' }])
      })
      return
    }

    const entitiesUrl = `folder/${folderId}?_join=content`

    axiosGetEntities(entitiesUrl).then(response => {
      if (response.failed) {
        console.error("Couldn't fetch files, try again")
        setLoading(false)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      const data = getResponseBody(response)

      if (getShortID(data[0].courseInstance[0]["@id"]) !== courseId) {
        props.history.push(ROUTES.ACCESS_DENIED)
        return
      }
      const fsObjects = data[0].content
      setFsObjects(
        fsObjects.filter(doc => doc.isDeleted === false)
      )
      setLoading(false)
      setFolder(data[0])
    })

    const pathUrl = `folder/${folderId}?_chain=parent`
    axiosGetEntities(pathUrl).then(response => {
      if (response.failed) {
        console.error("Couldn't fetch files, try again")
        setLoading(false)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      const data = getResponseBody(response)
      setFsPath(data.slice().reverse())
    })

  }, [courseId, folderId, showingDeleted, renderHack])

  const onFsObjectRowClick = (_, fsObject) => {
    if (DocumentEnums.folder.entityName === getShortType(fsObject['@type'])) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      history.push(
        redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
          { key: 'course_id', value: courseId },
          { key: 'folder_id', value: getShortID(fsObject['@id']) },
        ])
      )
      return
    }
    history.push(
      redirect(ROUTES.EDIT_DOCUMENT, [{ key: 'course_id', value: courseId }]),
      {
        documentId: getShortID(fsObject['@id']),
        parentFolderId: getShortID(folder["@id"]),
      }
    )
  }

  const createFolder = async () => {
    let data = {
      name: folderName,
      isDeleted: false,
      courseInstance: courseInstance['@id'],
    }
    toggleFolderDialog()
    if (fsPath.length) {
      data = {
        ...data,
        parent: fsPath[fsPath.length - 1]['@id'],
      }
    }

    const newFolderId = await axiosAddEntity(data, 'folder').then(response => {
      if (response.failed) {
        console.error('Folder creation failed: ', response.error)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      return getIRIFromAddResponse(response)
    })

    if (newFolderId) {
      const entityUrl = `folder/${folderId}`
      data = {
        content: [...fsObjects.map(doc => doc['@id']), newFolderId],
        lastChanged: new Date(),
      }

      axiosUpdateEntity(data, entityUrl).then(response => {
        if (response.failed) {
          console.error('Folder creation failed: ', response.error)
          setStatus(response.response ? response.response.status : 500)
          return
        }
        setRenderHack(x => x + 1)
      })
    }
  }

  const handleFolderCreate = () => {
    toggleFolderDialog()
    setIsFolderEdit(false)
  }

  const beginFolderEdit = folder => {
    toggleFolderDialog()
    setFolderName(folder.name)
    setEditFolderId(getShortID(folder['@id']))
    setIsFolderEdit(true)
  }

  const editFolder = () => {
    const folderUrl = `folder/${editFolderId}`
    const data = { name: folderName, lastChanged: new Date() }
    toggleFolderDialog()
    axiosUpdateEntity(data, folderUrl).then(response => {
      if (response.failed) {
        console.error('Folder edit failed: ', response.error)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      axiosUpdateEntity({ lastChanged: new Date() }, `folder/${folderId}`)
      setRenderHack(x => x + 1)
    })
  }

  if (status === 404) {
    return <Page404 />
  }

  const toggleFolderDialog = () => {
    setDialogOpen(prev => !prev)
    setFolderName('')
  }

  const onPathFolderClick = folderId => {
    history.push(
      redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
        { key: 'course_id', value: match.params.course_id },
        { key: 'folder_id', value: folderId },
      ])
    )
  }

  const handleFsObjectCut = fsObject => {
    setClipboardBeingCut(fsObject)
    setClipboardOldParent(folder)
    setIsRelocateDialogOpen(true)
  }

  const handlePaste = (pastingToFolder) => {
    setLoading(true)
    changeParent(
      clipboard.beingCut,
      pastingToFolder['@id'],
      clipboard.oldParent["@id"]
    ).then(() => {
      setIsRelocateDialogOpen(false)
      setLoading(false)
      setRenderHack(prev => prev + 1)
    })
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div style={{ maxWidth: 1000, margin: 'auto', padding: 20 }}>
        <br />
        {status !== 200 && (
          <>
            <Alert severity="warning">
              There has been a server error, try again please!
            </Alert>
            <br />
          </>
        )}
        {!showingDeleted && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <CreateDocumentMenu
              style={{ display: 'inline-block', float: 'left' }}
              onFolderCreate={handleFolderCreate}
              loading={loading}
            />
            <Button
              style={{ outline: 'none', float: 'right' }}
              variant="contained"
              disabled={loading}
              onClick={() =>
                history.push(
                  redirect(ROUTES.DELETED_DOCUMENTS, [
                    { key: 'course_id', value: courseId },
                  ])
                )
              }
              startIcon={<MdDelete />}
            >
              Deleted documents
            </Button>
          </div>
        )}
        <br />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            style={{ width: isMobile ? '100%' : '35%' }}
            id="search-textfield"
            label="search"
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
                outline: "none"
              }}
              variant="contained"
              onClick={() =>
                history.push(
                  redirect(ROUTES.DOCUMENTS, [
                    { key: 'course_id', value: courseId },
                  ])
                )
              }
            >
              <TiArrowBack/>
            </IconButton>
          )}
        </div>
        <br />
        <br />
        <LinearProgress
          style={{ visibility: loading ? 'visible' : 'hidden' }}
        />
        <FileExplorer
          files={fsObjects}
          search={search}
          fsPath={fsPath}
          onRowClickHandler={onFsObjectRowClick}
          onPathFolderClickHandler={onPathFolderClick}
          onCut={handleFsObjectCut}
          loading={loading}
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
      <RelocateDialog
        isOpen={isRelocateDialogOpen}
        onIsOpenChanged={setIsRelocateDialogOpen}
        label={'Move to'}
        onPaste={handlePaste}
      />
    </ThemeProvider>
  )
}

const mapStateToProps = ({
  courseInstanceReducer,
  folderReducer,
  authReducer,
  clipboardReducer,
}) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    folder: { ...folderReducer },
    clipboard: { ...clipboardReducer },
    user: authReducer.user,
  }
}

export default withRouter(
  connect(mapStateToProps, {setFolder, setClipboardBeingCut, setClipboardOldParent})(
    CourseDocumentManager
  )
)

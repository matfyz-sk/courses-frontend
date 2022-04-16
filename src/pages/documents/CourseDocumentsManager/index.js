import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert } from '@material-ui/lab'
import {
  Button,
  TextField,
  ThemeProvider,
  LinearProgress,
} from '@material-ui/core'
import {
  axiosGetEntities,
  axiosUpdateEntity,
  getShortType,
  getResponseBody,
  getShortID,
  axiosAddEntity,
  getIRIFromAddResponse,
} from 'helperFunctions'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import Page404 from '../../errors/Page404'
import {
  setFolder,
  setFolderContent,
  fetchFolder,
} from '../../../redux/actions'
import FileExplorer from '../FileExplorer'
import { DocumentEnums } from '../enums/document-enums'
import { customTheme } from '../styles/styles'
import FolderDialog from './FolderDialog'
import CreateDocumentMenu from './CreateDocumentMenu'
import { MdDelete } from 'react-icons/md'

function CourseDocumentManager(props) {
  const { courseInstance, folder, match, showingDeleted, setFolder, history } = props
  const [uglyFolderHack, setUglyFolderHack] = useState(0)

  const [isMobile, setIsMobile] = useState(false)
 
  const handleResize = () => {
    if (window.innerWidth < 720) {
        setIsMobile(true)
    } else {
        setIsMobile(false)
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  })

  const folderId = match.params.folder_id
  const courseId = match.params.course_id

  const [dialogOpen, setDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState('')

  const [fsPath, setFsPath] = useState([])

  const [fsObjects, setFsObjects] = useState([])

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(200)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setSearch('')

    const entitiesUrl = `folder/${folderId}?courseInstance=${courseId}&_chain=parent&_join=content`

    axiosGetEntities(entitiesUrl)
      .then(response => {
        if (response.failed) {
          console.error("Couldn't fetch files, try again")
          setLoading(false)
          setStatus(response.response ? response.response.status : 500)
          return
        }
        return getResponseBody(response)
      })
      .then(data => {
        const fsObjects = data[0].content
        console.log({fsObjects})
        setFsObjects(
          fsObjects.filter(doc => doc.isDeleted === showingDeleted)
        )
        setLoading(false)
        setFolder(data[0])
        setFsPath(data.slice().reverse())
      })
  }, [courseId, folderId, showingDeleted, uglyFolderHack])

  const invertDeletionFlag = fsObject => {
    const url = `${getShortType(fsObject['@type'])}/${getShortID(
      fsObject['@id']
    )}`

    fsObject.isDeleted = !fsObject.isDeleted // ? is this valid react, check with react strict mode?
    axiosUpdateEntity({ isDeleted: fsObject.isDeleted }, url).then(response => {
      if (response.failed) {
        console.error('Inverting was unsuccessful')
        setStatus(response.response ? response.response.status : 500)
      } else {
        setFsObjects(
          fsObjects.filter(obj => obj.isDeleted === showingDeleted)
        )
      }
    })
  }

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
      redirect(ROUTES.EDIT_DOCUMENT, [
        { key: 'course_id', value: courseId },
        { key: 'document_id', value: getShortID(fsObject['@id']) },
      ])
    )
  }

  const createFolder = async () => {
    var data = {
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
      var entityUrl = `folder/${folderId}`
      var data = {
        content: [...fsObjects.map(doc => doc['@id']), newFolderId],
      }

      axiosUpdateEntity(data, entityUrl).then(response => {
        if (response.failed) {
          console.error('Folder creation failed: ', response.error)
          setStatus(response.response ? response.response.status : 500)
          return
        }
        setUglyFolderHack(x => x + 1)
      })
    }
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
              dialogOpenHandler={setDialogOpen}
              loading={loading || folder.loading}
            />
            <div style={{ float: 'right' }}>
              <Button
                style={{ outline: "none" }}
                variant="contained"
                disabled={loading || folder.loading}
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
          </div>
        )}
        <br />
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
        <br />
        <br />
        <LinearProgress
          style={{ visibility: loading ? 'visible' : 'hidden' }}
        />
        <FileExplorer
          files={fsObjects}
          invertDeletionFlag={invertDeletionFlag}
          showingDeleted={showingDeleted}
          search={search}
          fsPath={fsPath}
          onRowClickHandler={onFsObjectRowClick}
          onPathFolderClickHandler={onPathFolderClick}
          loading={loading || folder.loading}
        />
      </div>
      <FolderDialog
        // isEdit
        open={dialogOpen}
        handleClose={toggleFolderDialog}
        folderName={folderName}
        setFolderName={setFolderName}
        submitHandler={createFolder}
      />
    </ThemeProvider>
  )
}

const mapStateToProps = ({ courseInstanceReducer, folderReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    folder: { ...folderReducer },
  }
}

export default withRouter(
  connect(mapStateToProps, { setFolder, setFolderContent, fetchFolder })(
    CourseDocumentManager
  )
)

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

  const [folderId, setFolderId] = useState(props.match.params.folder_id)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [folderName, setFolderName] = useState('')

  const [fsPath, setFsPath] = useState([])

  const [fsObjects, setFsObjects] = useState([])
  const [courseId, setCourseId] = useState(props.match.params.course_id)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(200)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFolderId(props.match.params.folder_id)
  }, [props.match.params.folder_id])

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
          fsObjects.filter(doc => doc.isDeleted === props.showingDeleted)
        )
        setLoading(false)
        props.setFolder(data[0])
        setFsPath(data.slice().reverse())
      })
  }, [courseId, folderId, props.showingDeleted, uglyFolderHack])

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
          fsObjects.filter(obj => obj.isDeleted === props.showingDeleted)
        )
      }
    })
  }

  const onFsObjectRowClick = (_, fsObject) => {
    const fileEntity = getShortType(fsObject['@type'])
    if (DocumentEnums.folder.entityName === fileEntity) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      props.history.push(
        redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
          { key: 'course_id', value: courseId },
          { key: 'folder_id', value: getShortID(fsObject['@id']) },
        ])
      )
      return
    }
    props.history.push(
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
      courseInstance: props.courseInstance['@id'],
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
        //   props.setCurrentDocumentsOfCourseInstance(
        //     data.hasDocument.map(doc => ({ '@id': doc }))
        //   )
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
    props.history.push(
      redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
        { key: 'course_id', value: props.match.params.course_id },
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
        {!props.showingDeleted && (
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
              loading={loading || props.folder.loading}
            />
            <div style={{ float: 'right' }}>
              <Button
                style={{ outline: "none" }}
                variant="contained"
                disabled={loading || props.folder.loading}
                onClick={() =>
                  props.history.push(
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
          showingDeleted={props.showingDeleted}
          search={search}
          fsPath={fsPath}
          onRowClickHandler={onFsObjectRowClick}
          onPathFolderClickHandler={onPathFolderClick}
          loading={loading || props.folder.loading}
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

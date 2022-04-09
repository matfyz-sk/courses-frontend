import React, { useState, useEffect, useRef } from 'react'
import FileExplorer from '../../FileExplorer'
import { DocumentEnums } from '../../enums/document-enums'
import {
  getShortType,
  getShortID,
  axiosGetEntities,
  getResponseBody,
} from 'helperFunctions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import DocumentsList from './DocumentsList'
import { makeStyles } from '@material-ui/styles'
import { customTheme } from 'pages/documents/styles/styles'

// dialog's intened behaviour is to reset the styling theme so this is a workaround for the progress bar
const useStyles = makeStyles(() => ({
  root: {
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: customTheme.palette.primary.main,
    },
    '& .MuiLinearProgress-barColorPrimary': {
      backgroundColor: '#9ecaab',
    },
  },
}))

function DocumentReferencer({
  label,
  documents,
  onDocumentsChange,
  match,
  courseInstance,
}) {
  const classes = useStyles()

  const [fsPath, setFsPath] = useState([])
  const [fsObjects, setFsObjects] = useState([])
  const [courseId, setCourseId] = useState(match.params.course_id)
  const [folderId, setFolderId] = useState('')
  const [status, setStatus] = useState(200)
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const dialogRef = useRef()

  useEffect(() => {
    if (courseInstance) {
      if (!courseInstance.fileExplorerRoot[0]) {
        setStatus(500)
        console.error('File system not initialized')
        return
      }
      setFolderId(getShortID(courseInstance.fileExplorerRoot[0]['@id']))
    }
  }, [courseInstance])

  useEffect(() => {
    if (folderId === '') return
    setLoading(true)

    const entitiesUrl = `folder/${folderId}?courseInstance=${courseId}&_chain=parent&_join=content`

    axiosGetEntities(entitiesUrl)
      .then(response => {
        setStatus(response.response ? response.response.status : 500)
        if (response.failed) {
          console.error("Couldn't fetch files, try again")
          setLoading(false)
          return
        }
        return getResponseBody(response)
      })
      .then(data => {
        const fsObjects = data[0].content
        setFsObjects(fsObjects)
        setLoading(false)
        // props.setFolder(data[0])
        // props.fetchFolder(folderId)
        setFsPath(data.slice().reverse())
      })
  }, [courseId, folderId])

  const addToDocuments = document => {
    onDocumentsChange([
      ...documents.filter(doc => doc['@id'] !== document['@id']),
      document,
    ])
  }

  const removeFromDocuments = document => {
    onDocumentsChange([
      ...documents.filter(doc => doc['@id'] !== document['@id']),
    ])
  }

  const onFsObjectRowClick = (_, fsObject) => {
    const fileEntity = getShortType(fsObject['@type'])
    if (DocumentEnums.folder.entityName === fileEntity) {
      setFolderId(getShortID(fsObject['@id']))
      dialogRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    addToDocuments(fsObject)
    setOpen(false)
  }

  const onPathFolderClick = folderId => {
    setFolderId(folderId)
  }

  return (
    <>
      <DocumentsList
        title={label}
        toggleSelection={() => setOpen(true)}
        documents={documents}
        onRemoveHandler={removeFromDocuments}
      />
      <Dialog
        open={open}
        onClose={_ => setOpen(false)}
        aria-labelledby="referencer-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="referencer-dialog-title" aria-label="add document">
          Choose document to add
        </DialogTitle>
        <DialogContent ref={dialogRef}>
          {status !== 200 && (
            <Alert severity="warning">
              Couldn't fetch files. You might need to initialize the file system
              in the documents section
            </Alert>
          )}
          <div className={classes.root}>
            <LinearProgress
              style={{
                visibility: loading ? 'visible' : 'hidden',
              }}
            />
          </div>
          <FileExplorer
            files={fsObjects}
            fsPath={fsPath}
            onRowClickHandler={onFsObjectRowClick}
            onPathFolderClickHandler={onPathFolderClick}
            isReferencer
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(connect(mapStateToProps, {})(DocumentReferencer))

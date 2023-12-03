import React, { useEffect, useRef, useState } from 'react'
import FileExplorer from '../../FileExplorer'
import { DocumentEnums } from '../enums/document-enums'
import { axiosGetEntities, getResponseBody, getShortID, getShortType, } from '../../../../helperFunctions'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Dialog, DialogContent, DialogTitle, LinearProgress, } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import DocumentsList from './DocumentsList'
import { makeStyles } from '@material-ui/styles'
import { customTheme } from '../../styles'
import getReferenceOfDocument from '../functions/documentReferenceCreation'
import { setFolder } from '../../../../redux/actions'

// dialog's intended behaviour is to reset the styling theme so this is a workaround for the progress bar
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
  documentReferences,
  onDocumentReferencesChange,
  match,
  courseInstance,
  isReadOnly,
}) {
  const classes = useStyles()

  const [documents, setDocuments] = useState([])

  const [fsPath, setFsPath] = useState([])
  const [fsObjects, setFsObjects] = useState([])
  const courseId = match.params.course_id
  const [folderId, setFolderId] = useState('')
  const [status, setStatus] = useState(200)
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const dialogRef = useRef()

  useEffect(() => {
    // folder gets set and document references find their corresponding docs
    if (courseInstance) {
      if (!courseInstance.fileExplorerRoot) {
        console.error('File system not initialized')
        return
      }
      setFolderId(getShortID(courseInstance.fileExplorerRoot['_id']))

      const docsPromises = []
      for (const docRef of documentReferences) {
        const entityUrl = `document/${getShortID(docRef.hasDocument)}`
        docsPromises.push(axiosGetEntities(entityUrl))
      }
      Promise.all(docsPromises).then(responses => {
        const documents = responses.map(
          response => getResponseBody(response)[0]
        )
        setDocuments(documents.filter(doc => !doc.isDeleted))
      })
    }
  }, [courseInstance, documentReferences])

  useEffect(() => {
    if (folderId === '') return
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
      setFsObjects(
        fsObjects.filter(doc => doc.isDeleted === false)
      )
      setLoading(false)
      setFsPath(data.slice().reverse())
    })
  }, [courseId, folderId, open])

  const addToDocuments = async document => {
    const documentRefId = await getReferenceOfDocument(document, courseInstance)
    onDocumentReferencesChange([
      ...documentReferences.filter(ref => ref['_id'] !== documentRefId),
      { '_id': documentRefId, hasDocument: document['_id'], courseInstance },
    ])
    setDocuments([
      ...documents.filter(doc => doc['_id'] !== document['_id']),
      document,
    ])
  }

  const removeFromDocuments = document => {
    onDocumentReferencesChange(
      documentReferences.filter(ref => ref.hasDocument !== document['_id'])
    )
    setDocuments(documents.filter(doc => doc['_id'] !== document['_id']))
  }

  const onFsObjectRowClick = (_, fsObject) => {
    const fileEntity = getShortType(fsObject['@type'])
    if (DocumentEnums.folder.entityName === fileEntity) {
      setFolderId(getShortID(fsObject['_id']))
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
        isReadOnly={isReadOnly}
      />
      <Dialog
        open={open}
        onClose={_ => setOpen(false)}
        aria-labelledby="referencer-dialog-title"
        maxWidth="md"
        fullWidth
        style={{ padding: '8px 12px' }}
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
                width: '100%',
              }}
            />
          </div>
          <FileExplorer
            files={fsObjects}
            fsPath={fsPath}
            onRowClickHandler={onFsObjectRowClick}
            onPathFolderClickHandler={onPathFolderClick}
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

export default withRouter(
  connect(mapStateToProps, {setFolder})(DocumentReferencer)
)

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { Redirect, withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { axiosGetEntities, fileToBase64, getResponseBody, getShortID, } from '../../helperFunctions'
import { Alert, Form, Label } from 'reactstrap'
import { HiDownload } from 'react-icons/hi'
import CustomEditor from './wysiwyg/ckeditor'
import { DocumentEnums } from './enums/document-enums'
import { fetchFolder, setCurrentDocumentsOfCourseInstance } from '../../redux/actions'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import Page404 from '../errors/Page404'
import { isValidHttpUrl } from '../../functions/validators'
import editDocument from './functions/documentCreation'
import downloadBase64File from './functions/downloadBase64File'
import MaterialForm from './MaterialForm'
import { customTheme } from './styles/styles'
import { MdDelete, MdHistory, MdRestorePage } from 'react-icons/md'
import removeDocumentReference from "./functions/removeDocumentReference";

function DocumentForm({
                        courseInstance,
                        creating,
                        folder,
                        history,
                        match,
                        user,
                        fetchFolder,
                        setCurrentDocumentsOfCourseInstance,
                        location
                      }) {
  // FIXME large base64 file uploads not working
  // FIXME only owner can do or see
  const [status, setStatus] = useState(200)

  const courseId = match.params.course_id
  if (!location.state && !creating) {
    return <Redirect to={redirect(ROUTES.DOCUMENTS, [{key: 'course_id', value: courseId}])}/>
  }

  // when creating a brand-new document
  const [entityName, setEntityName] = useState(creating || '')

  // both used when document already exists
  const documentId = location.state?.documentId ?? ""
  const parentFolderId = location.state?.parentFolderId ?? ""
  const [document, setDocument] = useState({})
  const isInEditingMode = documentId !== ''

  const [loadingMaterialRelations, setLoadingMaterialRelations] = useState(
    false
  )
  const [loadingDocument, setLoadingDocument] = useState(isInEditingMode)
  const [loading, setLoading] = useState(true)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // shared among all document subclasses
  const [name, setName] = useState('')
  const [isDeleted, setIsDeleted] = useState(false);

  const [isMaterial, setIsMaterial] = useState(true) // TODO resolve whether doc is material
  const [description, setDescription] = useState("")
  const [covers, setCovers] = useState([])
  const [mentions, setMentions] = useState([])
  const [requires, setRequires] = useState([])
  const [assumes, setAssumes] = useState([])
  const [isAlternativeTo, setIsAlternativeTo] = useState([])
  const [refersTo, setRefersTo] = useState([])
  const [generalizes, setGeneralizes] = useState([])

  // document subclass specific
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')
  const [uri, setUri] = useState('')
  const [content, setContent] = useState('')
  const [mimeType, setMimeType] = useState('text/html')

  const fetchDocument = useCallback(() => {
    if (!isInEditingMode) return

    setLoading(true)
    let entityUrl = `document/${documentId}?_join=payload`
    axiosGetEntities(entityUrl)
      .then(response => {
        if (response.failed) {
          console.error(response.error)
          setStatus(response.response ? response.response.status : 500)
          return
        }
        return getResponseBody(response)
      })
      .then(data => {
        const responseDocument = data[0]
        console.log({responseDocument})
        setDocument(responseDocument)
        setName(responseDocument.name)
        setIsDeleted(responseDocument.isDeleted)
        setIsReadOnly(responseDocument.isDeleted)
        if (getShortID(folder.id) !== location.state.parentFolderId)
          fetchFolder(location.state.parentFolderId)
        switch (responseDocument['@type']) {
          case DocumentEnums.internalDocument.id:
            setEntityName(DocumentEnums.internalDocument.entityName)
            setContent(responseDocument.payload[0].content)
            setMimeType(responseDocument.mimeType)
            break
          case DocumentEnums.externalDocument.id:
            setEntityName(DocumentEnums.externalDocument.entityName)
            setUri(responseDocument.uri)
            break
          case DocumentEnums.file.id:
            setFilename(responseDocument.filename)
            setEntityName(DocumentEnums.file.entityName)
            setContent(responseDocument.payload[0].content)
            setMimeType(responseDocument.mimeType)
            break
          default:
            break
        }
        setLoadingDocument(false)
      })
  }, [courseId, isInEditingMode])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  useEffect(() => {
    if (!loadingDocument && !loadingMaterialRelations && !folder.loading) {
      setLoading(false)
    }
  }, [loadingDocument, loadingMaterialRelations, folder.loading])

  const handleDelete = async e => {
    e.persist()
    await removeDocumentReference(documentId, courseId)
    await handleEdit(e, true)
  }

  const handleEdit = async (e, isBeingDeleted = false) => {
    e.preventDefault()
    if (!formValid()) {
      window.scrollTo({top: 0, behavior: 'smooth'})
      return
    }
    setIsReadOnly(true)
    let editProps = {
      courseId,
      entityName,
      setStatus,
      isInEditingMode,
      courseInstance,
      folder,
      user,
      setCurrentDocumentsOfCourseInstance
    };
    // if (isMaterial) {
    //   console.log('implement')
    //   editProps = {
    //     ...editProps,
    //     materialAttrs: {
    //       covers,
    //       mentions,
    //       requires,
    //       assumes,
    //       isAlternativeTo,
    //       refersTo,
    //       generalizes,
    //     }
    //   }
    // }
    const newVersionId = await editDocument(
      {
        name,
        mimeType,
        uri,
        filename,
        payload: [{content}],
        isDeleted: isBeingDeleted,
      },
      document,
      editProps
    )
    if (!newVersionId) {
      setStatus(500)
      setIsReadOnly(false)
      return
    }
    history.push(
      redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
        {key: 'course_id', value: courseId},
        {key: 'folder_id', value: getShortID(folder.id)},
      ])
    )
  }

  const onChangeFile = e => {
    fileToBase64(e.target.files[0]).then(base64Content => {
      setContent(base64Content)
      console.log({loaded: true})
    })
    setMimeType(e.target.files[0].type)
    setFilename(e.target.files[0].name)
    setFilePath(e.target.value)
  }

  const onDownloadFile = async e => {
    e.preventDefault()
    downloadBase64File(content, filename, mimeType, window)
  }

  const formValid = () => {
    let valid = name.length > 0
    switch (entityName) {
      case DocumentEnums.externalDocument.entityName:
        valid = valid && isValidHttpUrl(uri)
        break
      case DocumentEnums.file.entityName:
        valid = valid && filename.length > 0
        break
      default:
        break
    }
    return valid
  }

  if (status === 404) {
    return <Page404/>
  }

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Form
        style={{maxWidth: '1100px', margin: '20px auto', padding: 10}}
        onSubmit={handleEdit}
      >
        <div>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: !isInEditingMode ? '1em' : '0.5em',
            }}
          >
            Document {isInEditingMode ? 'editing' : 'creation'}
          </h2>
          {isInEditingMode && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '1em',
              }}
            >
              <IconButton
                aria-label="history"
                style={{
                  outline: 'none',
                  color: customTheme.palette.primary.main,
                }}
                onClick={() =>
                  history.push(
                    redirect(ROUTES.DOCUMENT_HISTORY, [
                      {
                        key: 'course_id',
                        value: courseId,
                      },
                    ]),
                    {
                      documentId: getShortID(document['@id']),
                      parentFolderId,
                    }
                  )
                }
              >
                <MdHistory/>
              </IconButton>
              <IconButton
                aria-label={isDeleted ? "restore" : "delete"}
                style={{
                  outline: 'none',
                  color: customTheme.palette.primary.main,
                }}
                onClick={isDeleted ? handleEdit : handleDelete}
              >
                {isDeleted ? <MdRestorePage/> : <MdDelete/>}
              </IconButton>
            </div>
          )}
        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <TextField
            error={name.length === 0}
            id="name-textfield"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            helperText={name.length === 0 ? 'Name is required' : ''}
            variant="outlined"
            disabled={isReadOnly}
          />
        </div>
        <br/>
        {entityName === DocumentEnums.externalDocument.entityName && (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <TextField
              error={!isValidHttpUrl(uri)}
              id="url-textfield"
              label="Url"
              type="url"
              fullWidth
              value={uri}
              onChange={e => setUri(e.target.value)}
              helperText={!isValidHttpUrl(uri) ? 'Valid url is required' : ''}
              variant="outlined"
              disabled={isReadOnly}
            />
          </div>
        )}
        {entityName === DocumentEnums.file.entityName && (
          <>
            <Input
              error={filename.length === 0}
              id="upload-button-file"
              type="file"
              style={{display: 'none'}}
              aria-describedby="file-upload-helper-text"
              value={filePath}
              onChange={onChangeFile}
              disabled={isReadOnly}
            />
            <InputLabel
              style={{display: 'inline'}}
              htmlFor="upload-button-file"
            >
              <Button disabled={isReadOnly} variant="contained" color="primary" component="span">
                Upload
              </Button>
            </InputLabel>
            <span style={{marginLeft: '3em'}}>
              {filename.length === 0 ? 'No file chosen' : filename}
            </span>

            {filename.length === 0 ? (
              <FormHelperText
                id="file-upload-helper-text"
                error={filename.length === 0}
              >
                {filename.length === 0 ? 'Have to chose file' : ''}
              </FormHelperText>
            ) : (
              <Label style={{marginLeft: '1.5em'}} for="file-download">
                <Link id="file-download" to={{}} onClick={onDownloadFile}>
                  {mimeType.startsWith('image') ? (
                    <img
                      style={{display: 'inline', maxWidth: '150px'}}
                      src={content}
                      alt="image of document"
                    />
                  ) : (
                    <HiDownload
                      style={{
                        fontSize: '400%',
                        color: customTheme.palette.primary.main,
                      }}
                    />
                  )}
                </Link>
              </Label>
            )}
          </>
        )}

        {entityName === DocumentEnums.internalDocument.entityName && (
          <>
            {!isInEditingMode && (
              <>
                <FormControl variant="outlined" style={{minWidth: 250}}>
                  <InputLabel id="format-select-label">Format</InputLabel>
                  <Select
                    labelId="format-select-label"
                    id="format-select"
                    value={mimeType}
                    onChange={e => setMimeType(e.target.value)}
                    label="Format"
                  >
                    <MenuItem value="text/html">Rich (html)</MenuItem>
                    <MenuItem value="text/markdown">
                      Lightweight (Markdown)
                    </MenuItem>
                  </Select>
                  <FormHelperText>
                    Can't change after saving document
                  </FormHelperText>
                </FormControl>
                <br/>
                <br/>
                <p style={{color: 'grey'}}>
                  Note: page breaks can be set via the horizontal line button
                </p>
              </>
            )}

            <CustomEditor
              content={content}
              setContent={setContent}
              mimeType={mimeType}
              isReadOnly={isReadOnly}
            />
            {content.length === 0 && (
              <p style={{color: customTheme.palette.error.main}}>
                Document can't be empty
              </p>
            )}
          </>
        )}
        <br/>
        <FormControlLabel
          label="Is material"
          control={
            <Checkbox
              checked={isMaterial}
              onChange={e => setIsMaterial(e.target.checked)}
              inputProps={{'aria-label': 'is material'}}
              disabled={isReadOnly}
            />
          }
        />
        <br/>

        {isMaterial && (
          <MaterialForm
            courseId={courseId}
            handleLoading={bool => setLoadingMaterialRelations(bool)}
            statusHandler={responseStatus => setStatus(responseStatus)}
            description={description}
            setDescription={setDescription}
            isAlternativeTo={isAlternativeTo}
            setIsAlternativeTo={setIsAlternativeTo}
            refersTo={refersTo}
            setRefersTo={setRefersTo}
            generalizes={generalizes}
            setGeneralizes={setGeneralizes}
            covers={covers}
            setCovers={setCovers}
            mentions={mentions}
            setMentions={setMentions}
            requires={requires}
            setRequires={setRequires}
            assumes={assumes}
            setAssumes={setAssumes}
            isReadOnly={isReadOnly}
          />
        )}
        {status !== 200 && (
          <Alert color="warning">
            There has been a server error, try again please!
          </Alert>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{width: '30%', margin: 'auto'}}
            size="large"
            type="submit"
            color="primary"
            variant="contained"
            disabled={isReadOnly}
          >
            Save document
          </Button>
        </div>
        {/* <pre>{JSON.stringify(document, null, 2)}</pre> */}
      </Form>
    </ThemeProvider>
  )
}

const mapStateToProps = state => {
  const {authReducer, courseInstanceReducer, folderReducer} = state
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
    folder: {...folderReducer},
  }
}

export default withRouter(
  connect(mapStateToProps, {fetchFolder, setCurrentDocumentsOfCourseInstance})(DocumentForm)
)

import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  TextField,
  ThemeProvider,
  InputLabel,
  Input,
} from '@material-ui/core'
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  axiosGetEntities,
  getResponseBody,
  fileToBase64,
} from 'helperFunctions'
import { Alert, Form, Label } from 'reactstrap'
import { HiDownload } from 'react-icons/hi'
import CustomEditor from './wysiwyg/ckeditor'
import { DocumentEnums } from './enums/document-enums'
import { setCurrentDocumentsOfCourseInstance } from '../../redux/actions'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import Page404 from '../errors/Page404'
import { isValidHttpUrl } from '../../functions/validators'
import editDocument from './functions/documentCreation'
import downloadBase64File from './functions/downloadBase64File'
import MaterialForm from './MaterialForm'
import { customTheme, useStyles } from './styles/styles'


function DocumentForm(props) {
  // FIXME large base64 file uploads not working
  // FIXME only owner can do or see
  // TODO change the role of courseInstance

  const style = useStyles()

  const [status, setStatus] = useState(200)

  const [courseId, setCourseId] = useState(props.match.params.course_id)

  // when creating a brand new document
  const [entityName, setEntityName] = useState(props.entityName || '')

  // both used when document already exists
  const [id, setId] = useState(props.match.params.document_id || '')
  const [document, setDocument] = useState({})
  const isInEditingMode = useCallback(() => id !== '', [id])

  const [loadingMaterialRelations, setLoadingMaterialRelations] = useState(
    false
  )
  const [loadingCourseInstance, setLoadingCourseInstance] = useState(
    props.courseInstance == null
  )
  const [loadingDocument, setLoadingDocument] = useState(isInEditingMode())
  const [loading, setLoading] = useState(true)

  // shared among all document subclasses
  const [name, setName] = useState('')

  const [isMaterial, setIsMaterial] = useState(false) // TODO setIsMaterial
  const [covers, setCovers] = useState([])
  const [mentions, setMentions] = useState([])
  const [requires, setRequires] = useState([])
  const [assumes, setAssumes] = useState([])
  const [isAlternativeTo, setIsAlternativeTo] = useState([])
  const [refersTo, setRefersTo] = useState([])
  const [generalizes, setGeneralizes] = useState([])

  // document subclass specific
  const [fileLoaded, setFileLoaded] = useState(false)
  const [file, setFile] = useState(null)
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')
  const [uri, setUri] = useState('')
  const [content, setContent] = useState('')
  const [mimeType, setMimeType] = useState('text/html')

  const fetchDocument = useCallback(() => {
    if (!isInEditingMode()) return

    setLoading(true)
    let entityUrl = `document/${id}?_join=payload`
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
        if (
          responseDocument.isDeleted ||
          responseDocument.nextVersion.length !== 0
        ) {
          // TODO not intended in the past course instances
          props.history.push(
            redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
          )
          return
        }
        setDocument(responseDocument)
        setName(responseDocument.name)
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

  useEffect(() => {}, [props.location.state])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  useEffect(() => {
    setLoadingCourseInstance(props.courseInstance == null)
  }, [props.courseInstance])

  useEffect(() => {
    if (!loadingCourseInstance && !loadingDocument && !loadingMaterialRelations)
      setLoading(false)
  }, [loadingCourseInstance, loadingDocument, loadingMaterialRelations])

  const handleEdit = async e => {
    e.preventDefault()
    if (!formValid()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    console.log({ props })
    const editProps = {
      courseId,
      entityName,
      setStatus,
      isInEditingMode: isInEditingMode(),
      ...props,
    }
    if (isMaterial) {
      console.log('implement')
    }
    const newVersionId = await editDocument(
      { name, mimeType, uri, filename, payload: [{ content }] },
      document,
      editProps
    )
    if (!newVersionId) {
      setStatus(500)
      return
    }
    props.history.push(
      redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
    )
  }

  const onChangeFile = e => {
    fileToBase64(e.target.files[0]).then(base64Content => {
      setContent(base64Content)
      console.log({ base64Content })
      setFileLoaded(true)
    })
    setMimeType(e.target.files[0].type)
    setFilename(e.target.files[0].name)
    setFilePath(e.target.value)
    console.log({ filename: e.target.files[0].name })
  }

  const onDownloadFile = async e => {
    e.preventDefault()
    downloadBase64File({ mimeType, filename, payload: [{ content }] }, window)
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
    return <Page404 />
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
        style={{ maxWidth: '1000px', margin: '20px auto' }}
        onSubmit={handleEdit}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>
          Document {isInEditingMode() ? 'editing' : 'creation'}
        </h1>
        <TextField
          error={name.length === 0}
          id="name-textfield"
          label="Name"
          type="text"
          style={{ width: '100%' }}
          value={name}
          onChange={e => setName(e.target.value)}
          helperText={name.length === 0 ? 'Name is required' : ''}
          variant="outlined"
        />
        <br />
        <br />
        {entityName === DocumentEnums.externalDocument.entityName && (
          <TextField
            error={!isValidHttpUrl(uri)}
            id="url-textfield"
            label="Url"
            type="url"
            style={{ width: '100%' }}
            value={uri}
            onChange={e => setUri(e.target.value)}
            helperText={!isValidHttpUrl(uri) ? 'Valid url is required' : ''}
            variant="outlined"
          />
        )}
        {entityName === DocumentEnums.file.entityName && (
          <>
            <Input
              error={filename.length === 0}
              id="upload-button-file"
              type="file"
              style={{ display: 'none' }}
              aria-describedby="file-upload-helper-text"
              value={filePath}
              onChange={onChangeFile}
            />
            <InputLabel
              style={{ display: 'inline' }}
              htmlFor="upload-button-file"
            >
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
            </InputLabel>
            <span style={{ marginLeft: '3em' }}>
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
              <Label style={{ marginLeft: '1.5em' }} for="file-download">
                <Link
                  id="file-download"
                  to={{ textDecoration: 'none' }}
                  onClick={onDownloadFile}
                >
                  <HiDownload
                    style={{ color: customTheme.palette.primary.main }}
                    className={style.icons}
                  />
                </Link>
              </Label>
            )}
          </>
        )}

        {entityName === DocumentEnums.internalDocument.entityName && (
          <>
            {!isInEditingMode() && (
              <>
                <FormControl variant="outlined" style={{ minWidth: 250 }}>
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
                <br />
                <br />
              </>
            )}

            <CustomEditor
              content={content}
              setContent={setContent}
              mimeType={mimeType}
            />
            {content.length === 0 && (
              <p style={{ color: customTheme.palette.error.main }}>
                Document can't be empty
              </p>
            )}
          </>
        )}
        <br />
        <br />
        <FormControlLabel
          label="Is material"
          control={
            <Checkbox
              checked={isMaterial}
              onChange={e => setIsMaterial(e.target.checked)}
              inputProps={{ 'aria-label': 'is material' }}
            />
          }
        />
        <br />

        {isMaterial && (
          <MaterialForm
            courseId={courseId}
            handleLoading={bool => setLoadingMaterialRelations(bool)}
            statusHandler={responseStatus => setStatus(responseStatus)}
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
          />
        )}
        {status !== 200 && (
          <Alert color="warning">
            There has been a server error, try again please!
          </Alert>
        )}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{ width: '30%', margin: 'auto' }}
            size="large"
            type="submit"
            color="primary"
            variant="contained"
          >
            Save document
          </Button>
        </Box>
        {/* <pre>{JSON.stringify(document, null, 2)}</pre> */}
      </Form>
    </ThemeProvider>
  )
}

const mapStateToProps = state => {
  const { authReducer, courseInstanceReducer, folderReducer } = state
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
    folder: { ...folderReducer },
  }
}

export default withRouter(
  connect(mapStateToProps, { setCurrentDocumentsOfCourseInstance })(
    DocumentForm
  )
)

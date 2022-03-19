import React, { useState, useEffect, useCallback } from 'react'
import { Alert, ListGroup, ListGroupItem } from 'reactstrap'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  axiosGetEntities,
  getResponseBody,
  getShortType,
  timestampToString2,
} from 'helperFunctions'
import { redirect } from '../../constants/redirect'
import * as ROUTES from '../../constants/routes'
import { Link } from 'react-router-dom'
import { setCurrentDocumentsOfCourseInstance } from '../../redux/actions'
import ReactHtmlParser from 'react-html-parser'
import diff from 'node-htmldiff'
import { DocumentEnums } from './enums/document-enums'
import editDocument from './functions/documentCreation'
import './styles/diff.css'
import './styles/mdStyling.css'
import { marked } from 'marked'
import { Radio } from '@material-ui/core'
import { MdChevronRight } from 'react-icons/md'
import { HiDownload } from 'react-icons/hi'
import downloadBase64File from './functions/downloadBase64File'

// TODO conventional styling
const sidebar = {
  overflowY: 'scroll',
  // position: "fixed",
  // left: 0,
  // right: 0,

  display: 'table-cell',
  width: '20%',
  verticalAlign: 'top',
  borderLeft: '1px solid',
}

const sidebarRow = {
  // borderBottom: '3px solid',
  borderWidth: '0 0 1px',
  padding: '5px',
}

const mainPage = {
  display: 'table',
  width: '100%',
}

const versionContentContainer = {
  overflowY: 'scroll',
  // position: "fixed",
  // left: 0,
  // right: 0,

  display: 'table-cell',
  width: '80%',
  verticalAlign: 'top',
}

const versionContent = {
  width: '80%',
  margin: '20px auto',
}

const isNewestVersion = version => {
  return !version.isDeleted && version.nextVersion.length === 0
}

function RevisionsSidebar({
  versions,
  setPickedVersionA,
  setPickedVersionB,
  handleRestore,
}) {
  const [selectedBefore, setSelectedBefore] = useState(1)
  const [selectedAfter, setSelectedAfter] = useState(0)

  const handleChangeA = e => {
    const vIndex = parseInt(e.target.value)
    setPickedVersionA(versions[vIndex])
    setSelectedAfter(vIndex)
  }

  const handleChangeB = e => {
    const vIndex = parseInt(e.target.value)
    setPickedVersionB(versions[vIndex])
    setSelectedBefore(vIndex)
  }

  return (
    <ListGroup flush style={sidebar} className="versions-sidebar">
      {versions.map((v, i) => {
        return (
          <ListGroupItem style={sidebarRow} key={i}>
            {timestampToString2(v.createdAt)}
            {selectedAfter < i && (
              <Radio
                style={{ marginLeft: '21px', color: GREENISH_COLOR }}
                checked={selectedBefore === i}
                onChange={handleChangeB}
                value={i}
                name="before-revisions"
                inputProps={{
                  'aria-label': `before from ${timestampToString2(
                    v.createdAt
                  )}`,
                }}
              />
            )}
            {i < selectedBefore && (
              <Radio
                style={
                  i <= selectedAfter
                    ? { marginLeft: '63px', color: GREENISH_COLOR }
                    : { color: GREENISH_COLOR }
                }
                checked={selectedAfter === i}
                onChange={handleChangeA}
                value={i}
                name="after-revisions"
                inputProps={{
                  'aria-label': `after all revisions up to ${timestampToString2(
                    v.createdAt
                  )}`,
                }}
              />
            )}

            {i === 0 && <p>Current version</p>}

            {v.restoredFrom && (
              <p>Restored from {timestampToString2(v.restoredFrom)}</p>
            )}
            {i > 0 && i < versions.length - 1 && (
              <p>
                <a
                  style={{ color: GREENISH_COLOR }}
                  href="#"
                  onClick={e => handleRestore(e, v)}
                >
                  restore
                </a>
              </p>
            )}
          </ListGroupItem>
        )
      })}
    </ListGroup>
  )
}

var GREENISH_COLOR = '#28a745'

function DocumentHistory(props) {
  // FIXME performance!
  // FIXME enlarged version content div?
  // TODO needs ins and dels: <hr> and page break?

  const [newestVersionId, setNewestVersionId] = useState(
    props.match.params.document_id
  )
  const [courseId, setCourseId] = useState(props.match.params.course_id)
  const [status, setStatus] = useState(200)
  const [entityName, setEntityName] = useState('')
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(false)
  const [pickedVersionA, setPickedVersionA] = useState({})
  const [pickedVersionB, setPickedVersionB] = useState({})

  const latestVersion = () => versions[0]
  const getPayloadContent = version => version.payload[0].content
  const hasEmptyContent = version => version.payload[0].content.length === 0

  const createOriginDummyVersion = firstVersion => {
    var dummy = {
      name: '',
      createdAt: firstVersion.createdAt,
      restoredFrom: '',
    }
    switch (getShortType(firstVersion['@type'])) {
      case DocumentEnums.internalDocument.entityName:
        var subclassSpecificParams = {
          mimeType: '',
          payload: [
            {
              content: '',
            },
          ],
        }
        break
      case DocumentEnums.externalDocument.entityName:
        var subclassSpecificParams = { uri: '' }
        break
      case DocumentEnums.file.entityName:
        var subclassSpecificParams = {
          filename: '',
          mimeType: '',
          payload: [
            {
              content: '',
            },
          ],
        }
        break
      default:
        break
    }
    return {
      ...dummy,
      ...subclassSpecificParams,
    }
  }

  useEffect(() => {
    setLoading(true)
    const entitiesUrl = `document/${newestVersionId}?_join=payload&_chain=previousVersion`
    axiosGetEntities(entitiesUrl).then(response => {
      if (response.failed) {
        console.error("There was a problem getting this document's history")
        setLoading(false)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      const data = getResponseBody(response)
      if (!isNewestVersion(data[0])) {
        props.history.push(
          redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
        )
        return
      }
      setEntityName(getShortType(data[0]['@type']))
      const paddedData = [
        ...data,
        createOriginDummyVersion(data[data.length - 1]),
      ]
      setPickedVersionA(paddedData[0])
      setPickedVersionB(paddedData[1]) // ?
      setVersions(paddedData)
      setLoading(false)
    })
  }, [newestVersionId, courseId])

  const handleRestore = async (e, versionToRestore) => {
    e.preventDefault()
    const editProps = {
      entityName,
      setStatus,
      isInEditingMode: true,
      restoredFrom: versionToRestore.createdAt,
      courseId: props.match.params.course_id,
      ...props,
    }
    const newVersionId = await editDocument(
      versionToRestore,
      latestVersion(),
      editProps
    )
    if (!newVersionId) return
    props.history.push(
      redirect(ROUTES.EDIT_DOCUMENT, [
        { key: 'course_id', value: courseId },
        { key: 'document_id', value: newVersionId },
      ])
    )
  }

  const diffPayloads = () => {
    if (!pickedVersionA.payload || !pickedVersionB.payload) {
      // ? have these constraint to loading?
      return
    }

    var before = getPayloadContent(pickedVersionB)
    var after = getPayloadContent(pickedVersionA)
    if (pickedVersionA.mimeType === 'text/markdown') {
      return diff(marked.parse(before), marked.parse(after), 'revisions-diff')
    }
    return diff(before, after, 'revisions-diff')
  }

  const onDownloadFile = (e, v) => {
    e.preventDefault() //? needed
    downloadBase64File(v, window)
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
    <div style={mainPage}>
      <div style={versionContentContainer}>
        <div className="diffing" style={versionContent}>
          <h5>Name:</h5>
          {ReactHtmlParser(
            diff(
              `<p>${pickedVersionB.name}</p>`,
              `<p>${pickedVersionA.name}</p>`,
              'revisions-diff'
            )
          )}
          {status !== 200 && (
            <Alert color="warning">
              There has been a server error, try again please!
            </Alert>
          )}
          {entityName === DocumentEnums.externalDocument.entityName && (
            <>
              <h5>Url:</h5>
              {pickedVersionB.uri.length !== 0 &&
                pickedVersionB.uri !== pickedVersionA.uri && (
                  <>
                    <a href={pickedVersionB.uri}>{pickedVersionB.uri}</a>
                    <MdChevronRight
                      size={28}
                      style={{
                        color: GREENISH_COLOR,
                        margin: '0 2em 0 2em',
                      }}
                    />
                  </>
                )}
              <a href={pickedVersionA.uri}>{pickedVersionA.uri}</a>
            </>
          )}
          {entityName === DocumentEnums.file.entityName && (
            <>
              <h5>Filename:</h5>
              {ReactHtmlParser(
                diff(
                  `<p>${pickedVersionB.filename}</p>`,
                  `<p>${pickedVersionA.filename}</p>`,
                  'revisions-diff'
                )
              )}
              <h5>File mime:</h5>
              {ReactHtmlParser(
                diff(
                  `<p>${pickedVersionB.mimeType}</p>`,
                  `<p>${pickedVersionA.mimeType}</p>`,
                  'revisions-diff'
                )
              )}
              <h5>File:</h5>

              {pickedVersionA.mimeType.startsWith('image') ? (
                <>
                  {!hasEmptyContent(pickedVersionB) &&
                    getPayloadContent(pickedVersionB) !==
                      getPayloadContent(pickedVersionA) && (
                      <>
                        <Link
                          id="file-download"
                          to={{ textDecoration: 'none' }}
                          onClick={e => onDownloadFile(e, pickedVersionB)}
                        >
                          <img
                            style={{ display: 'inline', maxWidth: '150px' }}
                            src={getPayloadContent(pickedVersionB)}
                          />
                        </Link>
                        <MdChevronRight
                          size={56}
                          style={{
                            color: GREENISH_COLOR,
                            margin: '0 2em 0 2em',
                          }}
                        />
                      </>
                    )}
                  <Link
                    id="file-download"
                    to={{ textDecoration: 'none' }}
                    onClick={e => onDownloadFile(e, pickedVersionB)}
                  >
                    <img
                      style={{ maxWidth: '150px' }}
                      src={getPayloadContent(pickedVersionA)}
                    />
                  </Link>
                </>
              ) : (
                <>
                  {!hasEmptyContent(pickedVersionB) &&
                    getPayloadContent(pickedVersionB) !==
                      getPayloadContent(pickedVersionA) && (
                      <>
                        <Link
                          id="file-download"
                          to={{ textDecoration: 'none' }}
                          onClick={e => onDownloadFile(e, pickedVersionB)}
                        >
                          <HiDownload
                            style={{ color: GREENISH_COLOR }}
                            size={42}
                          />
                        </Link>
                        <MdChevronRight
                          size={28}
                          style={{
                            color: GREENISH_COLOR,
                            margin: '0 2em 0 2em',
                          }}
                        />
                      </>
                    )}
                  <Link
                    id="file-download"
                    to={{ textDecoration: 'none' }}
                    onClick={e => onDownloadFile(e, pickedVersionA)}
                  >
                    <HiDownload style={{ color: GREENISH_COLOR }} size={42} />
                  </Link>
                </>
              )}
            </>
          )}
          {entityName === DocumentEnums.internalDocument.entityName && (
            <>
              {/*   want to use ckeditor styling but not its data processor */}
              <div className="ck ck-editor__main" role="presentation">
                <div
                  className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-read-only"
                  dir="ltr"
                  role="textbox"
                  aria-label="Rich Text Editor, main"
                  lang="en"
                  contentEditable={false}
                >
                  {ReactHtmlParser(diffPayloads())}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <RevisionsSidebar
        setPickedVersionA={setPickedVersionA}
        setPickedVersionB={setPickedVersionB}
        versions={versions}
        handleRestore={handleRestore}
      />
    </div>
  )
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, { setCurrentDocumentsOfCourseInstance })(
    DocumentHistory
  )
)

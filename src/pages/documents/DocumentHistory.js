import React, { useEffect, useState } from 'react'
import { Alert, ListGroup, ListGroupItem } from 'reactstrap'
import { Redirect, withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  axiosGetEntities,
  getResponseBody,
  getShortType,
  timestampToString2,
} from '../../helperFunctions'
import { redirect } from '../../constants/redirect'
import * as ROUTES from '../../constants/routes'
import { Link } from 'react-router-dom'
import {
  fetchFolder,
  setCurrentDocumentsOfCourseInstance,
} from '../../redux/actions'
import diff from 'node-htmldiff'
import { DocumentEnums } from './enums/document-enums'
import editDocument from './functions/documentCreation'
import './styles/diff.css'
import './styles/mdStyling.css'
import { marked } from 'marked'
import {
  IconButton,
  makeStyles,
  Radio,
  ThemeProvider,
  useMediaQuery,
} from '@material-ui/core'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { HiDownload } from 'react-icons/hi'
import downloadBase64File from './functions/downloadBase64File'
import { customTheme } from './styles/styles'
import Page404 from '../errors/Page404'

function TextComparator({ textA, textB }) {
  if (textB.length === 0 || textA === textB) {
    return <p>{textA}</p>
  }

  return (
    <p>
      <del
        style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
        className="revisions-diff"
      >
        {textB}
      </del>
      <MdChevronRight
        size={28}
        style={{
          color: 'grey',
          margin: '0 1em 0 1em',
        }}
      />
      <ins
        style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}
        className="revisions-diff"
      >
        {textA}
      </ins>
    </p>
  )
}

const useStyles = makeStyles({
  sidebar: {
    overflow: 'scroll',
    width: '20%',
    float: 'left',
    verticalAlign: 'top',
    borderLeft: '2px solid lightgrey',
    height: 'calc(100vh - 80px)',
  },
  sidebarRow: {
    borderWidth: '0 0 1px',
    padding: '10px',
  },
  mainPage: {
    display: 'table',
    width: '100%',
  },
  versionContentContainer: {
    float: 'left',
    width: '80%',
    verticalAlign: 'top',
    height: 'calc(100vh - 80px)',
    overflow: 'scroll',
  },
  versionContent: {
    width: '80%',
    margin: '20px auto',
  },
})

const getPayloadContent = version => version.payload[0].content
const hasEmptyContent = version => version.payload[0].content.length === 0

function RevisionsSidebar({
  versions,
  setPickedVersionA,
  setPickedVersionB,
  selectedAfter,
  selectedBefore,
  setSelectedAfter,
  setSelectedBefore,
  handleRestore,
  setShowSidebar,
}) {
  const style = useStyles()
  const isMobile = useMediaQuery('(max-width:760px)')
  const firstVersion = versions[0]

  const handleChangeA = e => {
    if (isMobile) {
      setShowSidebar(false)
    }
    const vIndex = parseInt(e.target.value)
    setPickedVersionA(versions[vIndex])
    setSelectedAfter(vIndex)
  }

  const handleChangeB = e => {
    if (isMobile) {
      setShowSidebar(false)
    }
    const vIndex = parseInt(e.target.value)
    setPickedVersionB(versions[vIndex])
    setSelectedBefore(vIndex)
  }

  return (
    <div style={{ width: isMobile && '100%' }} className={style.sidebar}>
      <ListGroup flush>
        {isMobile && (
          <ListGroupItem onClick={() => setShowSidebar(false)}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MdChevronLeft style={{ fontSize: '200%', color: 'grey' }} />
            </div>
          </ListGroupItem>
        )}
        {versions.map((v, i) => {
          return (
            <ListGroupItem className={style.sidebarRow} key={v["@id"]}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {timestampToString2(v.createdAt)}

                {!v.isDeleted && (
                  <>
                    <Radio
                      style={{
                        visibility: selectedAfter < i ? 'visible' : 'hidden',
                        marginLeft: 'auto',
                        color: customTheme.palette.primary.light,
                      }}
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
                    <Radio
                      style={{
                        visibility: i < selectedBefore ? 'visible' : 'hidden',
                        color: customTheme.palette.primary.light,
                      }}
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
                  </>
                )}
              </div>
              {i === 0 && (
                <p style={{ color: 'grey', marginBottom: 0 }}>
                  Current version
                </p>
              )}
              {v.isDeleted && (
                <p style={{ color: 'grey', marginBottom: 0 }}> Was deleted</p>
              )}
              {v.restoredFrom && (
                <p style={{ color: 'grey', marginBottom: 0 }}>
                  Restored from {timestampToString2(v.restoredFrom)}
                </p>
              )}
              {i > 0 && i < versions.length - 1 && (
                <>
                  {!firstVersion.isDeleted && !v.isDeleted && (
                    <a
                      style={{ color: customTheme.palette.primary.light }}
                      href="#"
                      onClick={e => handleRestore(e, v)}
                    >
                      restore
                    </a>
                  )}
                </>
              )}
            </ListGroupItem>
          )
        })}
      </ListGroup>
    </div>
  )
}

const markedOptions = {
  gfm: true,
  breaks: true,
  tables: true,
  xhtml: true,
  headerIds: false,
}

function DocumentHistory({
  match,
  history,
  fetchFolder,
  folder,
  courseInstance,
  setCurrentDocumentsOfCourseInstance,
  location,
}) {
  const courseId = match.params.course_id

  if (!location.state) {
    return (
      <Redirect
        to={redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])}
      />
    )
  }

  const style = useStyles()
  const newestVersionId = location.state.documentId
  const parentFolderId = location.state.parentFolderId
  const isMobile = useMediaQuery('(max-width:760px)')
  const [showSidebar, setShowSidebar] = useState(false)

  const [status, setStatus] = useState(200)
  const [entityName, setEntityName] = useState('')
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingVersions, setLoadingVersions] = useState(true)
  const [pickedVersionA, setPickedVersionA] = useState({})
  const [pickedVersionB, setPickedVersionB] = useState({})
  const [selectedBefore, setSelectedBefore] = useState(1)
  const [selectedAfter, setSelectedAfter] = useState(0)

  const latestVersion = () => versions[0]

  const createOriginDummyVersion = firstVersion => {
    const dummy = {
      "@id": `dummy-version-${firstVersion["@id"]}`,
      name: '',
      createdAt: firstVersion.createdAt,
      restoredFrom: '',
    }
    let subclassSpecificParams
    switch (getShortType(firstVersion['@type'])) {
      case DocumentEnums.internalDocument.entityName:
        subclassSpecificParams = {
          mimeType: '',
          payload: [
            {
              content: '',
            },
          ],
        }
        break
      case DocumentEnums.externalDocument.entityName:
        subclassSpecificParams = { uri: '' }
        break
      case DocumentEnums.file.entityName:
        subclassSpecificParams = {
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
    setLoadingVersions(true)
    const entitiesUrl = `document/${newestVersionId}?_join=payload&_chain=previousVersion`
    axiosGetEntities(entitiesUrl).then(response => {
      if (response.failed) {
        console.error("There was a problem getting this document's history")
        setLoading(false)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      const data = getResponseBody(response)
      if (folder["@id"] !== parentFolderId)
        fetchFolder(parentFolderId)
      setEntityName(getShortType(data[0]['@type']))
      const paddedData = [
        ...data,
        createOriginDummyVersion(data[data.length - 1]),
      ]
      const firstNonDeleted = paddedData.findIndex(doc => !doc.isDeleted)
      const secondNonDeleted = paddedData.findIndex(
        (doc, i) => !doc.isDeleted && i !== firstNonDeleted
      )
      setSelectedAfter(firstNonDeleted)
      setSelectedBefore(secondNonDeleted)
      setPickedVersionA(paddedData[firstNonDeleted])
      setPickedVersionB(paddedData[secondNonDeleted])
      setVersions(paddedData)
      setLoadingVersions(false)
    })
  }, [newestVersionId, courseId])

  useEffect(() => {
    if (!loadingVersions && !folder.loading) {
      setLoading(false)
    }
  }, [loadingVersions, folder.loading])

  const handleRestore = async (e, versionToRestore) => {
    e.preventDefault()
    const editProps = {
      isInEditingMode: true,
      courseInstance,
      setCurrentDocumentsOfCourseInstance,
    }
    // if (isMaterial) {
    //   console.log("implement")
    //   editProps = {
    //     ...editProps,
    //     materialAttrs: {
    //       covers: versionToRestore.material.covers,
    //       mentions: versionToRestore.material.mentions,
    //       requires: versionToRestore.material.requires,
    //       assumes: versionToRestore.material.assumes,
    //       isAlternativeTo: versionToRestore.material.isAlternativeTo,
    //       refersTo: versionToRestore.material.refersTo,
    //       generalizes: versionToRestore.material.generalizes,
    //     }
    //   }
    // }
    versionToRestore = {
      ...versionToRestore,
      restoredFrom: versionToRestore.createdAt,
      entityName,
      parent: folder
    }
    const newVersionId = await editDocument(
      versionToRestore,
      latestVersion(),
      editProps
    )
    if (!newVersionId) return
    history.push(
      redirect(ROUTES.EDIT_DOCUMENT, [
        { key: 'course_id', value: courseId },
        { key: 'document_id', value: newVersionId },
      ])
    )
  }

  const diffPayloads = () => {
    if (!pickedVersionA.payload || !pickedVersionB.payload) {
      return
    }

    let before = getPayloadContent(pickedVersionB)
    let after = getPayloadContent(pickedVersionA)
    if (pickedVersionA.mimeType === 'text/markdown') {
      before = marked.parse(before, markedOptions)
      after = marked.parse(after, markedOptions)
    }
    before = before.replaceAll('<hr>', '<hr>a</hr>')
    after = after.replaceAll('<hr>', '<hr>a</hr>')

    const documentsDiff = diff(before, after, 'revisions-diff')
    let cleanedDiff = documentsDiff.replaceAll('<hr>a</hr>', '<hr>')
    cleanedDiff = cleanedDiff.replaceAll(
      /<hr data-diff-node="ins" data-operation-index="\d+"><ins data-operation-index="\d+" class="revisions-diff">a<\/ins><\/hr>/g,
      '<hr data-diff-node="ins" class="revisions-diff">'
    )
    cleanedDiff = cleanedDiff.replaceAll(
      /<hr data-diff-node="del" data-operation-index="\d+"><del data-operation-index="\d+" class="revisions-diff">a<\/del><\/hr>/g,
      '<hr data-diff-node="del" class="revisions-diff">'
    )
    return cleanedDiff
  }

  const onDownloadFile = (e, v) => {
    e.preventDefault()
    downloadBase64File(v.payload[0].content, v.filename, v.mimeType, window)
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
      <div className={style.mainPage}>
        {(!isMobile || !showSidebar) && (
          <div
            style={{ width: isMobile && '100%' }}
            className={style.versionContentContainer}
          >
            <div
              className="diffing"
              style={{
                width: isMobile ? '100%' : '70%',
                margin: '10px auto',
                padding: 10,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <h5>Name:</h5>
                {isMobile && !showSidebar && (
                  <IconButton
                    style={{ marginLeft: 'auto', outline: 'none' }}
                    onClick={() => setShowSidebar(true)}
                  >
                    <MdChevronRight />
                  </IconButton>
                )}
              </div>
              <TextComparator
                textA={pickedVersionA.name}
                textB={pickedVersionB.name}
              />

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
                            color: 'grey',
                            margin: '0 1em 0 1em',
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
                  <TextComparator
                    textA={pickedVersionA.filename}
                    textB={pickedVersionB.filename}
                  />

                  <h5>File mime:</h5>
                  <TextComparator
                    textA={pickedVersionA.mimeType}
                    textB={pickedVersionB.mimeType}
                  />

                  <h5>File:</h5>
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
                            {pickedVersionB.mimeType.startsWith('image') ? (
                              <img
                                style={{ display: 'inline', maxWidth: '120px' }}
                                src={getPayloadContent(pickedVersionB)}
                                alt="image of the older document version"
                              />
                            ) : (
                              <HiDownload
                                style={{
                                  color: customTheme.palette.primary.main,
                                }}
                                size={42}
                              />
                            )}
                          </Link>
                          <MdChevronRight
                            size={42}
                            style={{
                              color: 'grey',
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
                      {pickedVersionA.mimeType.startsWith('image') ? (
                        <img
                          style={{ display: 'inline', maxWidth: '120px' }}
                          src={getPayloadContent(pickedVersionA)}
                          alt="image of the newer document version"
                        />
                      ) : (
                        <HiDownload
                          style={{
                            color: customTheme.palette.primary.main,
                          }}
                          size={42}
                        />
                      )}
                    </Link>
                  </>
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
                      dangerouslySetInnerHTML={{ __html: diffPayloads() }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {(!isMobile || showSidebar) && (
          <RevisionsSidebar
            setPickedVersionA={setPickedVersionA}
            setPickedVersionB={setPickedVersionB}
            selectedAfter={selectedAfter}
            selectedBefore={selectedBefore}
            setSelectedAfter={setSelectedAfter}
            setSelectedBefore={setSelectedBefore}
            versions={versions}
            handleRestore={handleRestore}
            setShowSidebar={setShowSidebar}
          />
        )}
      </div>
    </ThemeProvider>
  )
}

const mapStateToProps = ({
                           authReducer,
                           courseInstanceReducer,
                           folderReducer,
                         }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    folder: {...folderReducer},
  }
}

export default withRouter(
  connect(mapStateToProps, {fetchFolder, setCurrentDocumentsOfCourseInstance})(DocumentHistory)
)

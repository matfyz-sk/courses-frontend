import React, { useState, useEffect } from 'react'
import {
  Button,
  FormGroup,
  Label,
  Collapse,
  Input,
  Table,
  Alert,
} from 'reactstrap'
import { connect } from 'react-redux'
import classnames from 'classnames'
import CodeReview from './codeReview'
import {
  unixToString,
  timestampToString,
  htmlFixNewLines,
  prepareMultiline,
  getShortID,
  getStudentName,
  getRandomRolor,
  datesComparator,
  periodHasEnded,
} from 'helperFunctions'
import {
  setReviewProgress,
} from 'redux/actions'
import JSZip from 'jszip'
import { 
  useAddCommentMutation, 
  useAddCodeCommentMutation,
  useGetCommentOfSubmissionCreatedByQuery,
  useGetCommentOfSubmissionQuery,
} from 'services/assignments'

const mapStateToProps = () => {
  return {}
}

// 'function'
const Index = props => {
  // componentWillReceiveProps(props) {
  //   if (
  //     (!this.props.fileLoaded && props.fileLoaded) ||
  //     !sameStringForms(this.props.file, props.file)
  //   ) {
  //     this.setCurrentLocation(props)
  //   }
  // }
  const [file, setFile] = useState(null)
  const [files, setFiles] = useState([])
  const [fileError, setFileError] = useState(false)
  const [fileLoaded, setFileLoaded] = useState(false)

  const [sortBy, setSortBy] = useState('commentedAt')
  const [sortAscending, setSortAscending] = useState(false)

  const [messageColors, setMessageColors] = useState([])

  const [allCodeComments, setAllCodeComments] = useState([])
  const [codeComments, setCodeComments] = useState([])
  const [generalComments, setGeneralComments] = useState([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [codeCommentSaving, setCodeCommentSaving] = useState(false)

  const [newGeneralComment, setNewGeneralComment] = useState('')
  const [newGeneralCommentParent, setNewGeneralCommentParent] = useState(null)

  const [newSubcomment, setNewSubcomment] = useState('')
  const [addSubcomment, setAddSubcomment] = useState(null)

  const [currentFolder, setCurrentFolder] = useState('')
  const [currentDocument, setCurrentDocument] = useState(null)
  const [loadingDocument, setLoadingDocument] = useState(false)

  const [openedComments, setOpenedComments] = useState(false)
  const [forceOpenComment, setForceOpenComment] = useState(() => {})
  const [forceCloseComment, setForceCloseComment] = useState(() => {})

  const [generalCommentSaving, setGeneralCommentSaving] = useState(false)
  const [testFileError, setTestFileError] = useState(false)
  const [testFileLoaded, setTestFileLoaded] = useState(false)

  const [addComment, addCommentResult] = useAddCommentMutation()
  const [addCodeComment, addCodeCommentResult] = useAddCodeCommentMutation()

  const commentCreatorsVisible =
    props.assignment.reviewsVisibility === 'open' || props.settings.isInstructor
  var newID = 0

  useEffect(() => {
    fetchComments()
    setCodeReviewFile()
  }, [])

  useEffect(() => {
    setCurrentLocation(props)
  }, [currentFolder])

  useEffect(() => {
    if (file != null) {
      setCurrentLocation()
    }
  }, [file])

  const convertFromBase64 = base64File => {
    const i = base64File.indexOf('base64,')

    const buffer = Buffer.from(base64File.slice(i + 7), 'base64')

    const blob = new Blob([buffer], { type: 'application/zip' })

    var zip = new JSZip()
    zip
      .loadAsync(blob)
      .then(files => {
        setFile(files)
        setFileLoaded('raketak')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getSortedAllCodeComments = () => {
    let return1 = -1
    let return2 = 1
    if (!sortAscending) {
      return1 = 1
      return2 = -1
    }
    let sortFunction = () => {}

    switch (sortBy) {
      case 'commentBy': {
        sortFunction = (comment1, comment2) => {
          if (comment1.createdBy['@id'] === comment2.createdBy['@id']) {
            return datesComparator(comment1.createdAt, comment2.createdAt)
          }
          return comment1.createdBy['@id'] > comment2.createdBy['@id']
            ? return1
            : return2
        }
        break
      }
      case 'file': {
        sortFunction = (comment1, comment2) => {
          if (comment1.filePath === comment2.filePath) {
            return datesComparator(comment1.createdAt, comment2.createdAt)
          }
          return comment1.filePath > comment2.filePath ? return1 : return2
        }
        break
      }
      case 'commentedAt': {
        sortFunction = (comment1, comment2) =>
          datesComparator(
            comment1.createdAt,
            comment2.createdAt,
            false,
            sortAscending
          )
        break
      }
      default: {
        return
      }
    }
    return allCodeComments.sort((comment1, comment2) =>
      sortFunction(comment1, comment2)
    )
  }

  const addGeneralComment = () => {
    if (props.initialSubmission === null) {
      return
    }
    setGeneralCommentSaving(true)
    const newComment = {
      commentText: prepareMultiline(newGeneralComment),
      ofSubmission: props.initialSubmission['@id'],
      _type: 'comment',
    }
    if (newGeneralCommentParent !== null) {
      newComment.ofComment = newGeneralCommentParent['@id']
    }
    
    addComment(newComment).unwrap().then(response => {
      setGeneralCommentSaving(false)
      setNewGeneralComment('')
      setNewGeneralCommentParent(null)
      fetchComments()
    }).catch(error => {
      setGeneralCommentSaving(false)
      console.log(error)
    })
  }

  const fetchComments = () => {
    const initialSubmission = props.initialSubmission
    if (initialSubmission === null) {
      return
    }


    let getUser = commentCreatorsVisible ? '&_join=createdBy' : ''
    const {data, isSuccess} = getCommentGetRequest(commentCreatorsVisible, initialSubmission)
    if (isSuccess && data) {
      let allComments = data
      let messageColors = [...messageColors]
      allComments = allComments
        .sort((comment1, comment2) =>
          datesComparator(comment1.createdAt, comment2.createdAt)
        )
        .map(comment => {
          if (
            !messageColors.some(color => color.id === comment.createdBy['@id'])
          ) {
            messageColors.push({
              id: comment.createdBy['@id'],
              hex: getRandomRolor(),
              name: `Anonymous ${messageColors.length + 1}`,
            })
          }
          return {
            ...comment,
            color: messageColors.find(
              color => color.id === comment.createdBy['@id']
            ),
          }
        })
      let childComments = allComments.filter(
        comment => comment.ofComment.length !== 0
      )
      const parentComments = allComments
        .filter(comment => comment.ofComment.length === 0)
        .map(comment => ({
          ...comment,
          childComments: childComments
            .filter(
              subcomment => subcomment.ofComment[0]['@id'] === comment['@id']
            )
            .reverse(),
        }))
      const generalComments = parentComments.filter(
        comment => !comment['@type'].endsWith('CodeComment')
      )
      const codeComments = parentComments.filter(comment =>
        comment['@type'].endsWith('CodeComment')
      )
      const allCodeComments = allComments.filter(comment =>
        comment['@type'].endsWith('CodeComment')
      )
      setGeneralComments(generalComments)
      setCodeComments(codeComments)
      setAllCodeComments(allCodeComments)
      setCommentsLoaded(true)
      setMessageColors(messageColors)
    }
  }

  const addNewCodeComment = comment => {
    if (props.initialSubmission === null) {
      return
    }
    setCodeCommentSaving(true)
    const newComment = {
      ...comment,
      commentText: prepareMultiline(comment.commentText),
      commentedText: prepareMultiline(comment.commentedText),
      ofSubmission: props.initialSubmission['@id'],
      _type: 'codeComment',
    }
    addCodeComment(newComment).unwrap().then(response => {
      setCodeCommentSaving(false)
      fetchComments()
    }).catch(error => {
      setCodeCommentSaving(false)
      console.log(error)
    })
  }

  const getCommentBy = comment => {
    if (commentCreatorsVisible) {
      return getStudentName(comment.createdBy)
    }
    return comment.color.name
  }

  const setSortByType = type => {
    if (sortBy === type) {
      setSortAscending(!sortAscending)
      return
    }
    switch (type) {
      case 'commentBy':
      case 'file':
      case 'commentedAt': {
        setSortBy(type)
        setSortAscending(false)
        break
      }
      default: {
        return
      }
    }
  }

  const setCodeReviewFile = () => {
    try {
      const showImproved =
        periodHasEnded(props.assignment.improvedSubmissionPeriod) &&
        props.improvedSubmission != null

      setFile(showImproved
        ? convertFromBase64(props.improvedSubmission.submittedField[0].value)
        : convertFromBase64(props.initialSubmission.submittedField[0].value))
    } catch (e) {
      console.log(e)
      console.log(e.message)
      setFileError(true)
    }

    // return showImproved
    //   ? this.props.improvedSubmission.submittedField[0].value
    //   : this.props.initialSubmission.submittedField[0].value
  }

  // NOT NEEDED?
  // const getNewID = () => {
  //   return newID++
  // }

  const setCurrentLocation = () => {
    const entries = Object.keys(file.files).map(name => {
      return file.files[name]
    })
    const files = entries.filter(file => {
      let name = file.name
      let folder = currentFolder
      if (!name.includes(folder)) {
        return false
      }
      let fileName = name.substring(folder.length, name.length)
      return (
        name !== folder &&
        ((file.dir && fileName.split('/').length === 2) ||
          (!file.dir && fileName.split('/').length === 1))
      )
    })
    setFiles(files)
  }

  if (fileError) {
    return (
      <div>
        <Alert color="danger" className="mt-3">
          There is no submitted file to code-review.
        </Alert>
      </div>
    )
  }
  return (
    <div>
      <div className="bottomSeparator">
        <Table hover className="table-folder not-highlightable">
          <tbody>
            {currentFolder !== '' && (
              <tr
                className="clickable"
                onClick={() => {
                  let currentFolder = currentFolder
                  currentFolder = currentFolder.substring(
                    0,
                    currentFolder.lastIndexOf('/')
                  )
                  currentFolder = currentFolder.substring(
                    0,
                    currentFolder.lastIndexOf('/') + 1
                  )
                  setCurrentFolder(currentFolder)
                }}
              >
                <td colSpan="3">..</td>
              </tr>
            )}
            {files.map(file => (
              <tr
                key={file.name}
                className={classnames({ clickable: true })}
                onClick={() => {
                  if (file.dir) {
                    setCurrentFolder(file.name)
                  } else if (!loadingDocument) {
                    let name = file.name.substring(
                      currentFolder.length,
                      file.name.length
                    )
                    if (
                      currentDocument !== null &&
                      name === currentDocument.name
                    ) {
                      return
                    }
                    setLoadingDocument(true)
                    forceCloseComment()
                    file
                      .file(file.name)
                      .async('string')
                      .then(text => {
                        setLoadingDocument(false)
                        setCurrentDocument({
                          body: text,
                          name,
                          path: file.name,
                          fileExtension: name.substring(
                            name.lastIndexOf('.') + 1,
                            name.length
                          ),
                        })
                      })
                  }
                }}
              >
                <td style={{ width: 20 }}>
                  <i className={file.dir ? 'fa fa-folder' : 'fa fa-file'} />
                </td>
                <td>
                  {file.name.substring(
                    currentFolder.length,
                    file.name.length
                  )}
                </td>
                <td style={{ width: 150 }}>
                  {unixToString(file.date.getTime() / 1000)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <CodeReview
          currentDocument={currentDocument}
          loadingDocument={loadingDocument}
          setForceOpenComment={forceOpenComment =>
            setForceOpenComment(forceOpenComment)
          }
          setForceCloseComment={forceCloseComment =>
            setForceCloseComment(forceCloseComment)
          }
          disabled={false}
          allComments={codeComments}
          tabID={props.tabID}
          commentCreatorsVisible={commentCreatorsVisible}
          addComment={newComment => {
            addNewCodeComment(newComment)
          }}
        />
        <div>
          <div className="row">
            <h5>All comments</h5>
            <Button
              color="link"
              className="ml-auto"
              onClick={() =>
                setOpenedComments(!openedComments)
              }
            >
              {openedComments ? 'Hide' : 'Show'}
            </Button>
          </div>
          <Collapse isOpen={openedComments}>
            <Table striped>
              <thead>
                <tr>
                  <th>
                    <div className="center-hor">
                      Comment
                      <Button
                        color="link"
                        disabled={true}
                        style={{ color: 'white' }}
                      >
                        <i className="fa fa-arrow-up" />
                      </Button>
                    </div>
                  </th>
                  <th className="sort-title">
                    Comment by
                    <Button
                      className={classnames({
                        'sort-button': sortBy !== 'commentBy',
                      })}
                      color="link"
                      onClick={() => setSortByType('commentBy')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': sortAscending,
                          'fa fa-arrow-down': !sortAscending,
                        })}
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    File
                    <Button
                      className={classnames({
                        'sort-button': sortBy !== 'file',
                      })}
                      color="link"
                      onClick={() => setSortByType('file')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': sortAscending,
                          'fa fa-arrow-down': !sortAscending,
                        })}
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    Commented at
                    <Button
                      className={classnames({
                        'sort-button': sortBy !== 'commentedAt',
                      })}
                      color="link"
                      onClick={() => setSortByType('commentedAt')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': sortAscending,
                          'fa fa-arrow-down': !sortAscending,
                        })}
                      />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedAllCodeComments().map(comment => (
                  <tr
                    key={comment['@id']}
                    // className="clickable"
                    // onClick={() => {

                    //   if (!state.loadingDocument) {
                    //     let folder = ''
                    //     if (comment.filePath.includes('/')) {
                    //       folder = comment.filePath.substring(
                    //         0,
                    //         comment.filePath.lastIndexOf('/') + 1
                    //       )
                    //     }
                    //     let name = comment.filePath.substring(
                    //       folder.length,
                    //       comment.filePath.length
                    //     )
                    //     if (
                    //       state.currentDocument !== null &&
                    //       name === state.currentDocument.name
                    //     ) {

                    //       state.forceOpenComment(19)
                    //       return
                    //     }
                    //     setState({ ...state, loadingDocument: true })

                    //     state.file
                    //       .file(comment.filePath)
                    //       .async('string')
                    //       .then(text => {
                    //         setState({
                    //           ...state,
                    //           loadingDocument: false,
                    //           currentDocument: {
                    //             body: text,
                    //             name,
                    //             path: comment.filePath,
                    //             fileExtension: name.substring(
                    //               name.lastIndexOf('.') + 1,
                    //               name.length
                    //             ),
                    //           },
                    //           currentFolder: folder,
                    //         })
                    //       })
                    //   }
                    // }}
                  >
                    <td>{`${comment.commentText.substring(0, 20)}...`}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 'bolder',
                          color: comment.color.hex,
                          marginLeft: '0.5rem',
                        }}
                      >
                        {`${getCommentBy(comment)}`}
                      </span>
                    </td>
                    <td>{comment.filePath}</td>
                    <td>{timestampToString(comment.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Collapse>
        </div>

        <h3>
          <Label className="bold">General comments</Label>
        </h3>
        {generalComments.length === 0 && (
          <div style={{ fontStyle: 'italic' }}>
            There are currently no comments!
          </div>
        )}
        {generalComments.map(genComment => (
          <div key={genComment['@id']}>
            <Label className="flex row">
              Commented by
              <span
                style={{
                  fontWeight: 'bolder',
                  color: genComment.color.hex,
                  marginLeft: '0.5rem',
                }}
              >{`${getCommentBy(genComment)}`}</span>
              <div className="text-muted ml-auto">
                {timestampToString(genComment.createdAt)}
              </div>
            </Label>
            <div className="text-muted">
              <div
                dangerouslySetInnerHTML={{
                  __html: htmlFixNewLines(genComment.commentText),
                }}
              />
            </div>
            <div style={{ padding: '5px 10px' }}>
              {genComment.childComments.map(childComment => (
                <div key={childComment['@id']}>
                  <hr style={{ margin: 0 }} />
                  <Label className="flex row">
                    Commented by
                    <span
                      style={{
                        fontWeight: 'bolder',
                        color: childComment.color.hex,
                        marginLeft: '0.5rem',
                      }}
                    >{`${getCommentBy(childComment)}`}</span>
                    <div className="text-muted ml-auto">
                      {timestampToString(childComment.createdAt)}
                    </div>
                  </Label>
                  <div className="text-muted">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: htmlFixNewLines(childComment.commentText),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              color="link"
              onClick={() =>
                setNewGeneralCommentParent(genComment)
              }
            >
              <i className="fa fa-reply" /> Reply
            </Button>
            <hr />
          </div>
        ))}
        <FormGroup>
          <Label htmlFor="addCodeComment" style={{ fontWeight: 'bold' }}>
            New comment
          </Label>
          <Input
            id="addCodeComment"
            type="textarea"
            value={newGeneralComment}
            onChange={e =>
              setNewGeneralComment(e.target.value)
            }
          />
        </FormGroup>
        {newGeneralCommentParent && (
          <span>
            Commenting on{' '}
            {newGeneralCommentParent.commentText.substring(0, 10)}
            ...
            <Button
              color="link"
              className="ml-auto"
              onClick={() =>
                setNewGeneralCommentParent(null)
              }
            >
              <i className="fa fa-times" />
            </Button>
          </span>
        )}
        <Button
          color="primary"
          disabled={
            generalCommentSaving || newGeneralComment.length === 0
          }
          onClick={addGeneralComment}
        >
          Add comment
        </Button>
      </div>
    </div>
  )
}

const getCommentGetRequest = (commentCreatorsVisible, initialSubmission) => {
  if (commentCreatorsVisible) {
    return useGetCommentOfSubmissionCreatedByQuery(getShortID(initialSubmission['@id']))
  }
  return useGetCommentOfSubmissionQuery(getShortID(initialSubmission['@id']))
}

export default connect(mapStateToProps, {
  setReviewProgress,
})(Index)

import React, { Component, useState, useEffect } from 'react'
import {
  Button,
  FormGroup,
  Label,
  Collapse,
  Input,
  Table,
  FormText,
  Alert,
} from 'reactstrap'
import ErrorMessage from 'components/error'
import { connect } from 'react-redux'
import classnames from 'classnames'

import CodeReview from './codeReview'
import {
  unixToString,
  timestampToString,
  htmlFixNewLines,
  axiosGetEntities,
  getResponseBody,
  sameStringForms,
  axiosAddEntity,
  prepareMultiline,
  getShortID,
  getStudentName,
  getRandomRolor,
  datesComparator,
  periodHasEnded,
} from 'helperFunctions'
import {
  assignmentsGetTestFileLocally,
  assignmentsSetTestFile,
  setReviewProgress,
} from 'redux/actions'
import JSZip from 'jszip'

const mapStateToProps = () => {
  return {}
}

const initialState = {
  messageColors: [],

  allCodeComments: [],
  codeComments: [],
  generalComments: [],
  commentsLoaded: false,

  newGeneralComment: '',
  newGeneralCommentParent: null,
  generalCommentSaving: false,

  fileLoaded: false,
  file: null,
  files: [],
  fileError: false,

  openedComments: false,
  forceOpenComment: () => {},
  forceCloseComment: () => {},

  newSubcomment: '',
  addSubcomment: null,

  currentFolder: '',
  currentDocument: null,
  loadingDocument: false,

  sortAscending: false,
  sortBy: 'commentedAt',

  testFileError: false,
  testFileLoaded: false,
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

  const [state, setState] = useState(initialState)
  const commentCreatorsVisible =
    props.assignment.reviewsVisibility === 'open' || props.settings.isInstructor
  var newID = 0

  useEffect(() => {
    fetchComments()
    setCodeReviewFile()
  }, [])

  useEffect(() => {
    if (state.file != null) {
      setCurrentLocation()
    }
  }, [state.file])

  const convertFromBase64 = base64File => {
    const i = base64File.indexOf('base64,')

    const buffer = Buffer.from(base64File.slice(i + 7), 'base64')

    const blob = new Blob([buffer], { type: 'application/zip' })

    var zip = new JSZip()
    zip
      .loadAsync(blob)
      .then(files => {
        setState(state => {
          return { ...state, file: files, fileLoaded: 'raketak' }
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  const getSortedAllCodeComments = () => {
    let return1 = -1
    let return2 = 1
    if (!state.sortAscending) {
      return1 = 1
      return2 = -1
    }
    let sortFunction = () => {}

    switch (state.sortBy) {
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
            state.sortAscending
          )
        break
      }
      default: {
        return
      }
    }
    return state.allCodeComments.sort((comment1, comment2) =>
      sortFunction(comment1, comment2)
    )
  }

  const addGeneralComment = () => {
    if (props.initialSubmission === null) {
      return
    }
    setState({ ...state, generalCommentSaving: true })
    const newComment = {
      commentText: prepareMultiline(state.newGeneralComment),
      ofSubmission: props.initialSubmission['@id'],
      _type: 'comment',
    }
    if (state.newGeneralCommentParent !== null) {
      newComment.ofComment = state.newGeneralCommentParent['@id']
    }
    axiosAddEntity(newComment, 'comment')
      .then(response => {
        setState({
          ...state,
          generalCommentSaving: false,
          newGeneralComment: '',
          newGeneralCommentParent: null,
        })
        fetchComments()
      })
      .catch(error => {
        setState({ ...state, generalCommentSaving: false })
        console.log(error)
      })
  }

  const fetchComments = () => {
    const initialSubmission = props.initialSubmission
    if (initialSubmission === null) {
      return
    }
    let getUser = commentCreatorsVisible ? '&_join=createdBy' : ''
    axiosGetEntities(
      `comment?ofSubmission=${getShortID(initialSubmission['@id'])}${getUser}`
    ).then(response => {
      let allComments = getResponseBody(response)
      let messageColors = [...state.messageColors]
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
      setState(state => {
        return {
          ...state,
          generalComments,
          codeComments,
          allCodeComments,
          commentsLoaded: true,
          messageColors,
        }
      })
    })
  }

  const addCodeComment = comment => {
    if (props.initialSubmission === null) {
      return
    }
    setState({ ...state, codeCommentSaving: true })
    const newComment = {
      ...comment,
      commentText: prepareMultiline(comment.commentText),
      commentedText: prepareMultiline(comment.commentedText),
      ofSubmission: props.initialSubmission['@id'],
      _type: 'codeComment',
    }

    axiosAddEntity(newComment, 'codeComment')
      .then(response => {
        setState({ ...state, codeCommentSaving: false })
        fetchComments()
      })
      .catch(error => {
        setState({ ...state, codeCommentSaving: false })
        console.log(error)
      })
  }

  const getCommentBy = comment => {
    if (commentCreatorsVisible) {
      return getStudentName(comment.createdBy)
    }
    return comment.color.name
  }

  const setSortBy = type => {
    if (state.sortBy === type) {
      setState({ ...state, sortAscending: !state.sortAscending })
      return
    }
    switch (type) {
      case 'commentBy': {
        setState({ ...state, sortBy: type, sortAscending: false })
        break
      }
      case 'file': {
        setState({ ...state, sortBy: type, sortAscending: false })
        break
      }
      case 'commentedAt': {
        setState({ ...state, sortBy: type, sortAscending: false })
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

      setState({
        ...state,
        file: showImproved
          ? convertFromBase64(props.improvedSubmission.submittedField[0].value)
          : convertFromBase64(props.initialSubmission.submittedField[0].value),
      })
    } catch (e) {
      console.log(e)
      console.log(e.message)
      setState({ ...state, fileError: true })
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
    const entries = Object.keys(state.file.files).map(name => {
      return state.file.files[name]
    })
    const files = entries.filter(file => {
      let name = file.name
      let folder = state.currentFolder
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
    setState(state => {
      return { ...state, files }
    })
  }

  if (state.fileError) {
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
            {state.currentFolder !== '' && (
              <tr
                className="clickable"
                onClick={() => {
                  let currentFolder = state.currentFolder
                  currentFolder = currentFolder.substring(
                    0,
                    currentFolder.lastIndexOf('/')
                  )
                  currentFolder = currentFolder.substring(
                    0,
                    currentFolder.lastIndexOf('/') + 1
                  )
                  setState({ ...state, currentFolder }, () =>
                    setCurrentLocation(props)
                  )
                }}
              >
                <td colSpan="3">..</td>
              </tr>
            )}
            {state.files.map(file => (
              <tr
                key={file.name}
                className={classnames({ clickable: true })}
                onClick={() => {
                  if (file.dir) {
                    setState({ ...state, currentFolder: file.name }, () =>
                      setCurrentLocation(props)
                    )
                  } else if (!state.loadingDocument) {
                    let name = file.name.substring(
                      state.currentFolder.length,
                      file.name.length
                    )
                    if (
                      state.currentDocument !== null &&
                      name === state.currentDocument.name
                    ) {
                      return
                    }
                    setState({ ...state, loadingDocument: true })
                    state.forceCloseComment()
                    state.file
                      .file(file.name)
                      .async('string')
                      .then(text => {
                        setState({
                          ...state,
                          loadingDocument: false,
                          currentDocument: {
                            body: text,
                            name,
                            path: file.name,
                            fileExtension: name.substring(
                              name.lastIndexOf('.') + 1,
                              name.length
                            ),
                          },
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
                    state.currentFolder.length,
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
          currentDocument={state.currentDocument}
          loadingDocument={state.loadingDocument}
          setForceOpenComment={forceOpenComment =>
            setState({ ...state, forceOpenComment })
          }
          setForceCloseComment={forceCloseComment =>
            setState({ ...state, forceCloseComment })
          }
          disabled={false}
          allComments={state.codeComments}
          tabID={props.tabID}
          commentCreatorsVisible={commentCreatorsVisible}
          addComment={newComment => {
            addCodeComment(newComment)
          }}
        />
        <div>
          <div className="row">
            <h5>All comments</h5>
            <Button
              color="link"
              className="ml-auto"
              onClick={() =>
                setState({
                  ...state,
                  openedComments: !state.openedComments,
                })
              }
            >
              {state.openedComments ? 'Hide' : 'Show'}
            </Button>
          </div>
          <Collapse isOpen={state.openedComments}>
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
                        'sort-button': state.sortBy !== 'commentBy',
                      })}
                      color="link"
                      onClick={() => setSortBy('commentBy')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': state.sortAscending,
                          'fa fa-arrow-down': !state.sortAscending,
                        })}
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    File
                    <Button
                      className={classnames({
                        'sort-button': state.sortBy !== 'file',
                      })}
                      color="link"
                      onClick={() => setSortBy('file')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': state.sortAscending,
                          'fa fa-arrow-down': !state.sortAscending,
                        })}
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    Commented at
                    <Button
                      className={classnames({
                        'sort-button': state.sortBy !== 'commentedAt',
                      })}
                      color="link"
                      onClick={() => setSortBy('commentedAt')}
                    >
                      <i
                        className={classnames({
                          'fa fa-arrow-up': state.sortAscending,
                          'fa fa-arrow-down': !state.sortAscending,
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
        {state.generalComments.length === 0 && (
          <div style={{ fontStyle: 'italic' }}>
            There are currently no comments!
          </div>
        )}
        {state.generalComments.map(genComment => (
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
                setState({ ...state, newGeneralCommentParent: genComment })
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
            value={state.newGeneralComment}
            onChange={e =>
              setState({ ...state, newGeneralComment: e.target.value })
            }
          />
        </FormGroup>
        {state.newGeneralCommentParent && (
          <span>
            Commenting on{' '}
            {state.newGeneralCommentParent.commentText.substring(0, 10)}
            ...
            <Button
              color="link"
              className="ml-auto"
              onClick={() =>
                setState({ ...state, newGeneralCommentParent: null })
              }
            >
              <i className="fa fa-times" />
            </Button>
          </span>
        )}
        <Button
          color="primary"
          disabled={
            state.generalCommentSaving || state.newGeneralComment.length === 0
          }
          onClick={addGeneralComment}
        >
          Add comment
        </Button>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, {
  setReviewProgress,
})(Index)

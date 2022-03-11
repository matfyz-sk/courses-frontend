import React, { Component } from 'react';
import { Alert, Button, Collapse, FormGroup, FormText, Input, Label, Table } from 'reactstrap';
import ErrorMessage from 'components/error';
import { connect } from "react-redux";
import classnames from 'classnames';

import CodeReview from './codeReview';
import {
  axiosAddEntity,
  axiosGetEntities,
  datesComparator,
  getRandomRolor,
  getResponseBody,
  getShortID,
  getStudentName,
  htmlFixNewLines,
  prepareMultiline,
  sameStringForms,
  timestampToString,
  unixToString
} from 'helperFunctions';
import { assignmentsGetTestFileLocally, assignmentsSetTestFile } from 'redux/actions';

class CodeReviewContainer extends Component {
  constructor(props) {
    super(props);
    this.commentCreatorsVisible = this.props.assignment.reviewsVisibility === 'open' || this.props.settings.isInstructor;
    this.state = {
      messageColors: [],

      allCodeComments: [],
      codeComments: [],
      generalComments: [],
      commentsLoaded: false,

      newGeneralComment: '',
      newGeneralCommentParent: null,
      generalCommentSaving: false,

      file: null,
      files: [],

      openedComments: false,
      forceOpenComment: () => {
      },
      forceCloseComment: () => {
      },

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
    this.newID = 0;
    this.getNewID.bind(this);
    this.setCurrentLocation.bind(this);
    this.props.assignmentsGetTestFileLocally();
  }

  getNewID() {
    return this.newID++;
  }

  setCurrentLocation(props) {
    const entries = Object.keys(props.file.files).map((name) => {
      return props.file.files[name];
    });
    const files = entries.filter((file) => {
      let name = file.name;
      let folder = this.state.currentFolder;
      if(!name.includes(folder)) {
        return false;
      }
      let fileName = name.substring(folder.length, name.length);
      return (
        name !== folder &&
        (
          (
            file.dir &&
            fileName.split('/').length === 2
          ) ||
          (
            !file.dir &&
            fileName.split('/').length === 1
          )
        )
      )
    });
    this.setState({files});
  }

  fetchComments() {
    const initialSubmission = this.props.initialSubmission;
    if(initialSubmission === null) {
      return;
    }
    let getUser = this.commentCreatorsVisible ? "&_join=createdBy" : ""
    axiosGetEntities(`comment?ofSubmission=${ getShortID(initialSubmission['@id']) }${ getUser }`).then((response) => {
      let allComments = getResponseBody(response);
      let messageColors = [ ...this.state.messageColors ];
      allComments = allComments.sort((comment1, comment2) => datesComparator(comment1.createdAt, comment2.createdAt))
        .map((comment) => {
          if(!messageColors.some((color) => color.id === comment.createdBy['@id'])) {
            messageColors.push({
              id: comment.createdBy['@id'],
              hex: getRandomRolor(),
              name: `Anonymous ${ messageColors.length + 1 }`
            })
          }
          return {
            ...comment,
            color: messageColors.find((color) => color.id === comment.createdBy['@id']),
          }
        })
      let childComments = allComments.filter((comment) => comment.ofComment.length !== 0);
      const parentComments = allComments.filter((comment) => comment.ofComment.length === 0)
        .map((comment) => ({
          ...comment,
          childComments: childComments.filter((subcomment) => subcomment.ofComment[0]['@id'] === comment['@id']).reverse()
        }));
      const generalComments = parentComments.filter((comment) => !comment['@type'].endsWith('CodeComment'));
      const codeComments = parentComments.filter((comment) => comment['@type'].endsWith('CodeComment'));
      const allCodeComments = allComments.filter((comment) => comment['@type'].endsWith('CodeComment'));
      this.setState({generalComments, codeComments, allCodeComments, commentsLoaded: true, messageColors})
    })
  }

  componentWillReceiveProps(props) {
    if((!this.props.fileLoaded && props.fileLoaded) || !sameStringForms(this.props.file, props.file)) {
      this.setCurrentLocation(props);
    }
  }

  componentWillMount() {
    if(this.props.fileLoaded) {
      this.setCurrentLocation(this.props);
    }
    this.fetchComments();
  }

  addGeneralComment() {
    if(this.props.initialSubmission === null) {
      return;
    }
    this.setState({generalCommentSaving: true})
    const newComment = {
      commentText: prepareMultiline(this.state.newGeneralComment),
      ofSubmission: this.props.initialSubmission['@id'],
      _type: 'comment',
    }
    if(this.state.newGeneralCommentParent !== null) {
      newComment.ofComment = this.state.newGeneralCommentParent['@id']
    }
    axiosAddEntity(newComment, 'comment').then((response) => {
      this.setState({generalCommentSaving: false, newGeneralComment: '', newGeneralCommentParent: null})
      this.fetchComments();
    }).catch((error) => {
      this.setState({generalCommentSaving: false})
      console.log(error);
    })
  }

  addCodeComment(comment) {
    if(this.props.initialSubmission === null) {
      return;
    }
    this.setState({codeCommentSaving: true})
    const newComment = {
      ...comment,
      commentText: prepareMultiline(comment.commentText),
      commentedText: prepareMultiline(comment.commentedText),
      ofSubmission: this.props.initialSubmission['@id'],
      _type: 'codeComment',
    }
    axiosAddEntity(newComment, 'codeComment').then((response) => {
      this.setState({codeCommentSaving: false})
      this.fetchComments();
    }).catch((error) => {
      this.setState({codeCommentSaving: false})
      console.log(error);
    })
  }

  getCommentBy(comment) {
    if(this.commentCreatorsVisible) {
      return getStudentName(comment.createdBy)
    }
    return comment.color.name
  }

  setSortBy(type) {
    if(this.state.sortBy === type) {
      this.setState({sortAscending: !this.state.sortAscending})
      return;
    }
    switch(type) {
      case 'commentBy': {
        this.setState({sortBy: type, sortAscending: false})
        break;
      }
      case 'file': {
        this.setState({sortBy: type, sortAscending: false})
        break;
      }
      case 'commentedAt': {
        this.setState({sortBy: type, sortAscending: false})
        break;
      }
      default: {
        return;
      }
    }
  }

  getSortedAllCodeComments() {
    let return1 = -1;
    let return2 = 1;
    if(!this.state.sortAscending) {
      return1 = 1;
      return2 = -1;
    }
    let sortFunction = () => {
    }
    switch(this.state.sortBy) {
      case 'commentBy': {
        sortFunction = (comment1, comment2) => {
          if(comment1.createdBy['@id'] === comment2.createdBy['@id']) {
            return datesComparator(comment1.createdAt, comment2.createdAt)
          }
          return comment1.createdBy['@id'] > comment2.createdBy['@id'] ? return1 : return2
        }
        break;
      }
      case 'file': {
        sortFunction = (comment1, comment2) => {
          if(comment1.filePath === comment2.filePath) {
            return datesComparator(comment1.createdAt, comment2.createdAt)
          }
          return comment1.filePath > comment2.filePath ? return1 : return2
        }
        break;
      }
      case 'commentedAt': {
        sortFunction = (comment1, comment2) => datesComparator(comment1.createdAt, comment2.createdAt, false, this.state.sortAscending)
        break;
      }
      default: {
        return;
      }
    }
    return this.state.allCodeComments.sort((comment1, comment2) => sortFunction(comment1, comment2))
  }

  render() {
    const loading = !this.state.commentsLoaded;
    if(loading) {
      return (
        <Alert color="primary" className="mt-3">
          Loading comments...
        </Alert>
      )
    }
    return (
      <div>
        <div className="bottomSeparator">
          <Table hover className="table-folder not-highlightable">
            <tbody>
            { this.state.currentFolder !== '' &&
              <tr
                className="clickable"
                onClick={ () => {
                  let currentFolder = this.state.currentFolder;
                  currentFolder = currentFolder.substring(0, currentFolder.lastIndexOf('/'));
                  currentFolder = currentFolder.substring(0, currentFolder.lastIndexOf('/') + 1);
                  this.setState({currentFolder}, () => this.setCurrentLocation(this.props))
                } }>
                <td colSpan="3">..</td>
              </tr>
            }
            { this.state.files.map((file) =>
              <tr
                key={ file.name }
                className={ classnames({clickable: true}) }
                onClick={ () => {
                  if(file.dir) {
                    this.setState({currentFolder: file.name}, () => this.setCurrentLocation(this.props))
                  } else if(!this.state.loadingDocument) {
                    let name = file.name.substring(this.state.currentFolder.length, file.name.length);
                    if(this.state.currentDocument !== null && name === this.state.currentDocument.name) {
                      return;
                    }
                    this.setState({loadingDocument: true})
                    this.state.forceCloseComment();
                    this.props.file.file(file.name).async('string').then((text) => {
                      this.setState({
                        loadingDocument: false,
                        currentDocument: {
                          body: text,
                          name,
                          path: file.name,
                          fileExtension: name.substring(name.lastIndexOf('.') + 1, name.length),
                        }
                      });
                    })
                  }
                } }>
                <td style={ {width: 20} }><i className={ file.dir ? "fa fa-folder" : 'fa fa-file' }/></td>
                <td>{ file.name.substring(this.state.currentFolder.length, file.name.length) }</td>
                <td style={ {width: 150} }>{ unixToString(file.date.getTime() / 1000) }</td>
              </tr>
            ) }
            </tbody>
          </Table>

          <CodeReview
            currentDocument={ this.state.currentDocument }
            loadingDocument={ this.state.loadingDocument }
            setForceOpenComment={ (forceOpenComment) => this.setState({forceOpenComment}) }
            setForceCloseComment={ (forceCloseComment) => this.setState({forceCloseComment}) }
            disabled={ this.state.testFileLoaded }
            allComments={ this.state.codeComments }
            tabID={ this.props.tabID }
            commentCreatorsVisible={ this.commentCreatorsVisible }
            addComment={ (newComment) => {
              this.addCodeComment(newComment);
            } }
          />

          <FormGroup>
            <Label for={ `codeReview-test` }>Load own test zip file</Label>
            <FormText color="muted">You wont be able to add comments as it could cause breaking problems ( comments are
              bind to submission that should have unchanged zip file ) </FormText>
            <Input name="codeReview"
                   type="file"
                   accept=".zip"
                   id="codeReview-test"
                   onChange={ (e) => {
                     this.setState({testFileError: false})
                     if(e.target.files.length === 1) {
                       let file = e.target.files[0];
                       if(file.type === 'application/x-zip-compressed') {
                         this.setState({currentFolder: '', currentDocument: null, testFileLoaded: true})
                         this.props.assignmentsSetTestFile(file);
                       } else {
                         this.setState({testFileError: true})
                       }
                     }
                   } }
            />
            <ErrorMessage show={ this.state.testFileError } message="File is not zip file!"/>
          </FormGroup>

          <div>
            <div className="row">
              <h5>Jump to comment</h5>
              <Button color="link" className="ml-auto"
                      onClick={ () => this.setState({openedComments: !this.state.openedComments}) }
              >
                { this.state.openedComments ? 'Hide' : 'Show' }
              </Button>
            </div>
            <Collapse isOpen={ this.state.openedComments }>
              <Table striped>
                <thead>
                <tr>
                  <th>
                    <div className="center-hor">
                      Comment
                      <Button
                        color="link"
                        disabled={ true }
                        style={ {color: 'white'} }
                      >
                        <i className="fa fa-arrow-up"/>
                      </Button>
                    </div>
                  </th>
                  <th className="sort-title">
                    Comment by
                    <Button
                      className={ classnames({
                        "sort-button": this.state.sortBy !== "commentBy"
                      }) }
                      color="link"
                      onClick={ () => this.setSortBy('commentBy') }
                    >
                      <i className={ classnames({
                        "fa fa-arrow-up": this.state.sortAscending,
                        "fa fa-arrow-down": !this.state.sortAscending,
                      }) }
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    File
                    <Button
                      className={ classnames({
                        "sort-button": this.state.sortBy !== "file"
                      }) }
                      color="link"
                      onClick={ () => this.setSortBy('file') }
                    >
                      <i className={ classnames({
                        "fa fa-arrow-up": this.state.sortAscending,
                        "fa fa-arrow-down": !this.state.sortAscending,
                      }) }
                      />
                    </Button>
                  </th>
                  <th className="sort-title">
                    Commented at
                    <Button
                      className={ classnames({
                        "sort-button": this.state.sortBy !== "commentedAt"
                      }) }
                      color="link"
                      onClick={ () => this.setSortBy('commentedAt') }
                    >
                      <i className={ classnames({
                        "fa fa-arrow-up": this.state.sortAscending,
                        "fa fa-arrow-down": !this.state.sortAscending,
                      }) }
                      />
                    </Button>
                  </th>
                </tr>
                </thead>
                <tbody>
                { this.getSortedAllCodeComments().map((comment) =>
                  <tr
                    key={ comment['@id'] }
                    className="clickable"
                    onClick={ () => {
                      if(!this.state.loadingDocument) {
                        let folder = "";
                        if(comment.filePath.includes('/')) {
                          folder = comment.filePath.substring(0, comment.filePath.lastIndexOf('/') + 1)
                        }
                        let name = comment.filePath.substring(folder.length, comment.filePath.length);
                        if(this.state.currentDocument !== null && name === this.state.currentDocument.name) {
                          this.state.forceOpenComment(comment.commentedTextFrom);
                          return;
                        }
                        this.setState({loadingDocument: true})
                        this.props.file.file(comment.filePath).async('string').then((text) => {
                          this.setState({
                            loadingDocument: false,
                            currentDocument: {
                              body: text,
                              name,
                              path: comment.filePath,
                              fileExtension: name.substring(name.lastIndexOf('.') + 1, name.length),
                            },
                            currentFolder: folder
                          }, () => {
                            this.setCurrentLocation(this.props);
                            this.state.forceOpenComment(comment.commentedTextFrom);
                          });
                        })
                      }
                    } }
                  >
                    <td>{ `${ comment.commentText.substring(0, 20) }...` }</td>
                    <td>
                      <span
                        style={ {
                          fontWeight: 'bolder',
                          color: comment.color.hex, marginLeft: '0.5rem'
                        } }
                      >
                        { `${ this.getCommentBy(comment) }` }
                      </span>
                    </td>
                    <td>{ comment.filePath }</td>
                    <td>{ timestampToString(comment.createdAt) }</td>
                  </tr>
                ) }
                </tbody>
              </Table>
            </Collapse>
          </div>

          <h3><Label className="bold">General comments</Label></h3>
          { this.state.generalComments.length === 0 && <div style={ {fontStyle: 'italic'} }>
            There are currently no comments!
          </div> }
          { this.state.generalComments.map((genComment) =>
            <div key={ genComment['@id'] }>
              <Label className="flex row">Commented by
                <span style={ {
                  fontWeight: 'bolder',
                  color: genComment.color.hex,
                  marginLeft: '0.5rem'
                } }>{ `${ this.getCommentBy(genComment) }` }</span>
                <div className="text-muted ml-auto">
                  { timestampToString(genComment.createdAt) }
                </div>
              </Label>
              <div className="text-muted">
                <div dangerouslySetInnerHTML={ {__html: htmlFixNewLines(genComment.commentText)} }/>
              </div>
              <div style={ {padding: '5px 10px'} }>
                { genComment.childComments.map((childComment) =>
                  <div key={ childComment['@id'] }>
                    <hr style={ {margin: 0} }/>
                    <Label className="flex row">Commented by
                      <span style={ {
                        fontWeight: 'bolder',
                        color: childComment.color.hex,
                        marginLeft: '0.5rem'
                      } }>{ `${ this.getCommentBy(childComment) }` }</span>
                      <div className="text-muted ml-auto">
                        { timestampToString(childComment.createdAt) }
                      </div>
                    </Label>
                    <div className="text-muted">
                      <div dangerouslySetInnerHTML={ {__html: htmlFixNewLines(childComment.commentText)} }/>
                    </div>
                  </div>
                ) }
              </div>
              <Button
                color="link"
                onClick={ () => this.setState({newGeneralCommentParent: genComment}) }
              >
                <i className="fa fa-reply"/> Reply
              </Button>
              <hr/>
            </div>
          ) }
          <FormGroup>
            <Label htmlFor="addCodeComment" style={ {fontWeight: 'bold'} }>New comment</Label>
            <Input id="addCodeComment" type="textarea" value={ this.state.newGeneralComment }
                   onChange={ (e) => this.setState({newGeneralComment: e.target.value}) }/>
          </FormGroup>
          { this.state.newGeneralCommentParent && <span>
            Commenting on { this.state.newGeneralCommentParent.commentText.substring(0, 10) }...
            <Button color="link" className="ml-auto"
                    onClick={ () => this.setState({newGeneralCommentParent: null}) }
            >
              <i className="fa fa-times"/>
            </Button>
          </span> }
          <Button
            color="primary"
            disabled={ this.state.generalCommentSaving || this.state.newGeneralComment.length === 0 }
            onClick={ this.addGeneralComment.bind(this) }
          >
            Add comment
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({assignTestFileReducer}) => {
  const {file, fileLoaded} = assignTestFileReducer;
  return {
    file, fileLoaded
  };
};

export default connect(mapStateToProps, {assignmentsGetTestFileLocally, assignmentsSetTestFile})(CodeReviewContainer);

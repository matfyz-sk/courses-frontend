import React, { Component } from 'react';
import { Button, FormGroup, Label, ListGroup, ListGroupItem, Collapse, PopoverHeader, PopoverBody, Popover, Input, Table, FormText } from 'reactstrap';
import ErrorMessage from 'components/error';
import { connect } from "react-redux";
import classnames from 'classnames';

import CodeReview from './codeReview';
import { timestampToString, getFileType, htmlFixNewLines, axiosGetEntities, getResponseBody, sameStringForms } from 'helperFunctions';
import { assignmentsGetTestFileLocally, assignmentsSetTestFile  } from 'redux/actions';

class CodeReviewContainer extends Component {
  constructor(props){
    super(props);
    this.state={
      allComments: [],
      allCommentsLoaded: false,

      file: null,
      files: [],


      openedComments: false,

      newSubcomment: '',
      addSubcomment: null,

      currentFolder: '',
      currentDocument: null,
      loadingDocument: false,

      generalComments: [],

      newGeneralComment: '',

      generalParentComment: null,

      testFileError: false,
      testFileLoaded: false,
    }
    this.newID = 0;
    this.getNewID.bind(this);
    this.setCurrentLocation.bind(this);
    this.props.assignmentsGetTestFileLocally();
  }

  getNewID(){
    return this.newID ++;
  }

  setCurrentLocation(props){
    const entries = Object.keys(props.file.files).map((name) => {
      return props.file.files[name];
    });
    const files = entries.filter((file)=>{
      let name = file.name;
      let folder = this.state.currentFolder;
      if(!name.includes(folder)){
        return false;
      }
      let fileName = name.substring(folder.length,name.length);
      return (
        name !== folder &&
        (
          (
            file.dir &&
            fileName.split('/').length===2
          )||
          (
            !file.dir &&
            fileName.split('/').length===1
          )
        )
      )
    });
    this.setState({files});
  }

  fetchComments(){
    if(this.props.intialSubmission !== null){
      axiosGetEntities(`codeComment?ofSubmission=${this.props.intialSubmission['@id']}`).then((response)=>{
        const allComments = getResponseBody(response);
        this.setState({ allComments, allCommentsLoaded:true })
      })
    }
  }

  componentWillReceiveProps(props){
    if( (!this.props.fileLoaded && props.fileLoaded) ||  !sameStringForms( this.props.file, props.file ) ){
      this.setCurrentLocation(props);
    }
  }

  componentWillMount(){
    if(this.props.fileLoaded){
      this.setCurrentLocation(this.props);
    }
  }

  render(){

    return(
      <div>
        <div className="bottomSeparator">
          <Table hover className="table-folder not-highlightable">
            <tbody>
              { this.state.currentFolder!=='' &&
                <tr
                  className="clickable"
                  onClick={()=>{
                    let currentFolder = this.state.currentFolder;
                    currentFolder = currentFolder.substring(0,currentFolder.lastIndexOf('/'));
                    currentFolder = currentFolder.substring(0,currentFolder.lastIndexOf('/')+1);
                    this.setState({currentFolder})
                  }}>
                  <td colSpan="3">..</td>
                </tr>
              }
              {this.state.files.map((file)=>
                <tr
                  key={file.name}
                  className={classnames({clickable:true})}
                  onClick={()=>{
                    if(file.dir){
                      this.setState({currentFolder:file.name}, () => this.setCurrentLocation(this.props))
                    }else if(!this.state.loadingDocument){
                      let name = file.name.substring(this.state.currentFolder.length,file.name.length);
                      if(this.state.currentDocument!==null && name===this.state.currentDocument.name){
                        return;
                      }
                      this.setState({loadingDocument:true})
                      this.props.file.file(file.name).async('string').then((text)=>{
                        this.setState({
                          loadingDocument:false,
                          currentDocument:{
                            body:text,
                            name,
                            path:file.name,
                            fileExtension:name.substring(name.lastIndexOf('.')+1,name.length),
                          }
                        });
                      })
                    }
                  }}>
                  <td style={{width:20}}><i className={file.dir?"fa fa-folder":'fa fa-file'} /></td>
                  <td>{file.name.substring(this.state.currentFolder.length,file.name.length)}</td>
                  <td style={{width:150}}>{timestampToString(file.date.getTime()/1000)}</td>
                </tr>
              )}
            </tbody>
          </Table>

          <CodeReview
            currentDocument={ this.state.currentDocument }
            loadingDocument={ this.state.loadingDocument }
            disabled={ this.state.testFileLoaded }
            allComments={ this.state.allComments }
            match={ this.props.match }
            addComment={ (newComment) => {
              this.setState({ allComments: [...this.state.allComments, newComment] })
            } }
            addSubcomment={(newSubcomment) => {
            }}
            />

          <FormGroup>
            <Label for={`codeReview-test`}>Load own test zip file</Label>
            <FormText color="muted">You wont be able to add comments as it could cause breaking problems ( comments are bind to submission that should have unchanged zip file ) </FormText>
            <Input name="codeReview"
              type="file"
              accept=".zip"
              id="codeReview-test"
              onChange={(e)=>{
                this.setState({ testFileError: false })
                if(e.target.files.length === 1){
                  let file = e.target.files[0];
                  if(file.type === 'application/x-zip-compressed'){
                    this.setState({ currentFolder: '', currentDocument: null, testFileLoaded: true })
                    this.props.assignmentsSetTestFile(file);
                  }else{
                    this.setState({ testFileError: true })
                  }
                }
              }}
              />
            <ErrorMessage show={this.state.testFileError} message="File is not zip file!" />
          </FormGroup>

          <div>
            <div className="row">
              <h5>Jump to comment</h5>
              <Button color="link" className="ml-auto"
                onClick={()=>this.setState({openedComments:!this.state.openedComments})}
                >
                {this.state.openedComments?'Hide':'Show'}
              </Button>
            </div>
            <Collapse isOpen={this.state.openedComments}>
              <ListGroup>
                <ListGroupItem action className="clickable">
                  Cras justo odio
                </ListGroupItem>
                <ListGroupItem action className="clickable">
                  Dapibus ac facilisis in
                </ListGroupItem>
                <ListGroupItem action className="clickable">
                  Morbi leo risus
                </ListGroupItem>
                <ListGroupItem action className="clickable">Porta ac consectetur ac</ListGroupItem>
              </ListGroup>
            </Collapse>
          </div>

          <Label className="bold">General comments</Label>
          {this.state.generalComments.length===0 && <div style={{ fontStyle: 'italic' }}>
          There are currently no comments!
        </div>}
        {this.state.generalComments.map((genComment)=>
          <div key={genComment.id}>
            <Label>{'Commented by '}
              <span style={{fontWeight:'bolder'}}>{genComment.creator}</span>
            </Label>
            <p className="text-muted">
              <div dangerouslySetInnerHTML = {{__html: htmlFixNewLines(genComment.comment) }} />
            </p>
            <div style={{padding:'5px 10px'}}>
              {genComment.childComments.map((childComment)=>
                <div key={childComment.id}>
                  <hr/>
                  <Label>{'Commented by '}
                    <span style={{fontWeight:'bolder'}}>{childComment.creator}</span>
                  </Label>
                  <p className="text-muted">
                    <div dangerouslySetInnerHTML = {{__html: htmlFixNewLines(childComment.comment) }} />
                  </p>
                </div>
              )}
            </div>
            <Button
              color="link"
              onClick={()=>this.setState({generalParentComment:genComment})}
              >
              <i className="fa fa-reply" /> Reply
              </Button>
              <hr/>
            </div>
          )}
          <FormGroup>
            <Label htmlFor="addCodeComment" style={{fontWeight:'bold'}}>New comment</Label>
            <Input id="addCodeComment" type="textarea" value={this.state.newGeneralComment} onChange={(e)=>this.setState({newGeneralComment:e.target.value})}/>
          </FormGroup>
          {this.state.generalParentComment && <span>
            Commenting on {this.state.generalParentComment.comment.substring(0,10)}...
            <Button color="link" className="ml-auto"
              onClick={()=>this.setState({generalParentComment:null})}
              >
              <i className="fa fa-times" />
            </Button>
          </span>}
          <Button
            color="primary"
            onClick={()=>{
              let newSubcomment = {
                id:this.getNewID(),
                creator:'Maroš Rezba',
                comment:this.state.newGeneralComment,
              }
              if(this.state.generalParentComment){
                let newGeneralComments = [...this.state.generalComments];
                newGeneralComments.find((item)=>item.id === this.state.generalParentComment.id).childComments.push(newSubcomment);
                this.setState({generalParentComment:null,generalComments:newGeneralComments, newGeneralComment:''});
              }else{
                newSubcomment.childComments = [];
                this.setState({generalParentComment:null,generalComments:[...this.state.generalComments, newSubcomment], newGeneralComment:''});
              }
            }}
            >
            Add comment
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({assignTestFileReducer}) => {
  const { file, fileLoaded } = assignTestFileReducer;
  return {
    file, fileLoaded
  };
};

export default connect(mapStateToProps, { assignmentsGetTestFileLocally, assignmentsSetTestFile })(CodeReviewContainer);

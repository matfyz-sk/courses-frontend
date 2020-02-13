import React, { Component } from 'react';
import { Button, FormGroup, Label, ListGroup, ListGroupItem, Collapse, PopoverHeader, PopoverBody, Popover, Input, Table } from 'reactstrap';
import { connect } from "react-redux";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';
import classnames from 'classnames';

import { timestampToString, getFileType, htmlFixNewLines } from '../../../../helperFunctions';
import { assignmentsGetTestFileLocally } from '../../../../redux/actions';

var fakeComments = [
  {
    id:0,
    path:'teacher/assignments.js',
    creator:'Maroš Rezba',
    from:1,
    childComments:[],
    to:3,
    text:`{ Component } from 'react';
import AssignmentView from './assignmentView';
import AddAssignment from './addAssignment';`,
    comment:'You should delete all of this useless imports you made here. Please check the console for warnings and fix them!',
  }
]

class CodeReview extends Component {
  constructor(props){
    super(props);
    this.state={
      file:null,
      openedComments:false,

      allComments:[...fakeComments],
      showComments:[],
      addComment:null,

      openAddComment:false,

      newSubcomment:'',
      addSubcomment:null,

      currentFolder:'',
      currentDocument:null,
      loadingDocument:false,
      newCodeComment:'',
      commentsLocation:null,

      showCommentMenu:null,
      newID:0,

      generalComments:[],
      newGeneralComment:'',
      generalParentComment:null,
    }
    this.getNewID.bind(this);
    this.deconstructZIP.bind(this);
    this.getComments.bind(this);
    this.props.assignmentsGetTestFileLocally();
  }

  getNewID(){
    let newID = this.state.newID + 1;
    this.setState({newID});
    return newID;
  }

  deconstructZIP(){
    var entries = Object.keys(this.props.file.files).map((name) => {
      return this.props.file.files[name];
    });
    return entries.filter((file)=>{
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
  }

  getComments(lineNumber){
    return this.state.allComments.filter((comment)=>comment.path===this.state.currentDocument.path && lineNumber >= comment.from && lineNumber <= comment.to);
  }

  findElement(selector, lineNumber) {
    let elements = document.querySelectorAll(selector);
    return [].filter.call(elements, function(element){
      return parseInt(element.textContent) === lineNumber;
    })[0];
  }

  perLineProps(lineNumber){
    let self = this;
    let comments = this.getComments(lineNumber);
    return {
      style: { display: 'block',backgroundColor:comments.length > 0 ? 'grey':'inherit' },
      onClick() {
        if(comments.length>0){
          let element = self.findElement(".react-syntax-highlighter-line-number ",lineNumber);
          self.setState({addComment:null, openAddComment:false, showComments:comments, commentsLocation:{top:element.offsetTop,left:element.parentElement.parentElement.offsetLeft + element.parentElement.parentElement.offsetWidth + 50}});
        }else{
          self.setState({addComment:null, openAddComment:false, commentsLocation:null})
        }
      },
      onMouseUp(e){
        var selectedText = '';
        // window.getSelection
        if (window.getSelection) {
            selectedText = window.getSelection();
        }
        // document.getSelection
        else if (document.getSelection) {
            selectedText = document.getSelection();
        }
        // document.selection
        else if (document.selection) {
            selectedText = document.selection.createRange().text;
        } else return;
        if(selectedText.toString().length!==0){
          let element = self.findElement(".react-syntax-highlighter-line-number ",lineNumber);
          self.setState({openAddComment:false,commentsLocation:null,addComment:{position:{top:element.offsetTop,left:element.offsetLeft + element.parentElement.parentElement.offsetWidth },text:selectedText.toString(),element, lineNumber }});
        }else{
          self.setState({addComment:null, openAddComment:false})
        }
      }
    }
  }

  normalizeText(text){
    return text.replace(/(?:\r\n|\r|\n)/g, '\n');
  }

  getCodeLocation(body, text, editorLineNumber){
    let nBody = this.normalizeText(body);
    let nText = this.normalizeText(text);
    let lineCount = nText.split('\n').length;
    let splitBody = nBody.split('\n');
    let lineNumber = editorLineNumber - 1;
    let topBody = splitBody.slice(lineNumber + 1  - lineCount, lineNumber + 1).join('\n').includes(nText);
    let bottomBody = splitBody.slice(lineNumber, lineNumber + lineCount + 1).join('\n').includes(nText);
    if(topBody && bottomBody){
      return { from: editorLineNumber, to: editorLineNumber }
    }else if(topBody){
      return {from : editorLineNumber - lineCount + 1, to: editorLineNumber }
    }
    return {from : editorLineNumber, to: editorLineNumber + lineCount - 1 }
  }

  render(){
    let files = [];
    if(this.props.fileLoaded){
      files = this.deconstructZIP();
    }

    return(
      <div>
          <div className="bottomSeparator">
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
                {files.map((file)=>
                  <tr
                    key={file.name}
                    className={classnames({clickable:true})}
                    onClick={()=>{
                      if(file.dir){
                        this.setState({currentFolder:file.name})
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
                    <td style={{width:150}}>{timestampToString(file.date.getTime())}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {this.state.currentDocument!==null &&
              <div>
                <h5>Viewing file: {this.state.currentDocument.name}</h5>
                <SyntaxHighlighter
                  language={getFileType(this.state.currentDocument.fileExtension)}
                  lineProps={this.perLineProps.bind(this)}
                  showLineNumbers
                  style={okaidia}
                  wrapLines={true}
                  children={this.state.currentDocument.body}
                  />
              </div>
          }
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

              <div
                id="viewCodeCommentBlock"
                style={{
                  position:'absolute',
                  display:this.state.commentsLocation === null? 'none': 'block',
                  top: this.state.commentsLocation === null ? 100 : this.state.commentsLocation.top,
                  left: this.state.commentsLocation === null ? 100 : this.state.commentsLocation.left,
                }}
                />
              <Button
                color="link"
                className="ml-auto"
                id="addCodeCommentBlock"
                style={{
                  position:'absolute',
                  display:this.state.addComment === null? 'none': 'block',
                  top: this.state.addComment === null ? 100 : this.state.addComment.position.top,
                  left: this.state.addComment === null ? 100 : this.state.addComment.position.left,
                }}
                onClick={()=>this.setState({openAddComment:!this.state.openAddComment})}
                >
                <i className="far fa-comment" />
              </Button>

              { this.state.openAddComment && this.props.match.params.tabID === "2" &&
                <Popover placement="right" className="bigPopover" isOpen={this.state.openAddComment} toggle={()=>{this.setState({openAddComment:false})}} target="addCodeCommentBlock">
                <PopoverHeader>Add comment</PopoverHeader>
                <PopoverBody>

                  <FormGroup>
                    <Label>Commented code</Label>
                    <SyntaxHighlighter
                      language={getFileType(this.state.currentDocument.fileExtension)}
                      style={okaidia}
                      children={this.state.openAddComment===null?'':this.state.addComment.text}
                      />
                  </FormGroup>

                  <FormGroup>
                    <Label htmlFor="addCodeComment">Comment</Label>
                    <Input id="addCodeComment" type="textarea" value={this.state.newCodeComment} onChange={(e)=>this.setState({newCodeComment:e.target.value})}/>
                  </FormGroup>
                  <div className="row">
                    <Button color="danger" className="mr-auto" onClick={()=>{this.setState({openAddComment:false})}}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onClick={()=>{
                        let loc = this.getCodeLocation(this.state.currentDocument.body, this.state.addComment.text, this.state.addComment.lineNumber);

                        let newCodeComment = {
                          ...loc,
                          childComments:[],
                          id:this.getNewID(),
                          creator:'Maroš Rezba',
                          path:this.state.currentDocument.path,
                          text:this.state.addComment.text,
                          comment:this.state.newCodeComment,
                        }
                        this.setState({openAddComment:false,addComment:null, newCodeComment:'',allComments:[...this.state.allComments, newCodeComment]})
                      }}
                      >
                      Add comment
                    </Button>
                  </div>
                </PopoverBody>
              </Popover>
              }
              { this.state.commentsLocation!==null && this.props.match.params.tabID === "2" &&
                <Popover placement="right" className="bigPopover" isOpen={this.state.commentsLocation!==null} toggle={()=>{this.setState({commentsLocation:null})}} target="viewCodeCommentBlock">
                <PopoverHeader>Current comments</PopoverHeader>
                <PopoverBody>
                  { this.state.showComments.map((comment)=>
                    <div className="comment-section" key={comment.id}>
                      <Label>{'Commented code by '}
                        <span style={{fontWeight:'bolder'}}>{comment.creator}</span>
                      </Label>
                      <SyntaxHighlighter
                        language={getFileType(this.state.currentDocument.fileExtension)}
                        style={okaidia}
                        children={this.state.commentsLocation===null?'':comment.text}
                        />
                      <p className="text-muted">
                        {comment.comment}
                      </p>
                      { comment.childComments.map((childComment)=>
                        <div key={childComment.id} style={{padding:'5px 10px'}}>
                          <p className="text-muted">
                            {childComment.comment}
                          </p>
                          <hr/>
                        </div>
                      )}
                      { this.state.addSubcomment !== comment.id && <Button
                        color="link"
                        className="pull-right comment-reply-button"
                        onClick={()=>this.setState({addSubcomment:comment.id})}
                        >
                        <i className="fa fa-reply" /> Reply
                      </Button>}
                      {this.state.addSubcomment === comment.id && <div>
                        <FormGroup>
                          <Label htmlFor="addCodeComment">Subcomment</Label>
                          <Input id="addCodeSubcomment" type="textarea" value={this.state.newSubcomment} onChange={(e)=>this.setState({newSubcomment:e.target.value})}/>
                        </FormGroup>
                        <div className="row">
                          <Button color="danger" className="mr-auto" onClick={()=>{this.setState({addSubcomment:null, newSubcomment:''})}}>
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onClick={()=>{
                              let newSubcomment = {
                                id:this.getNewID(),
                                creator:'Maroš Rezba',
                                comment:this.state.newSubcomment,
                              }
                              let newComments = [...this.state.allComments];
                              newComments.find((item)=>item.id === this.state.addSubcomment).childComments.push(newSubcomment);
                              this.setState({addSubcomment:null,allComments:newComments, newSubcomment:''});
                            }}
                            >
                            Add comment
                          </Button>
                        </div>
                      </div>}
                      <hr/>
                    </div>
                  )}
                </PopoverBody>
              </Popover>
              }
          </div>
      </div>
    )
  }
}

const mapStateToProps = ({assignmentsTestFileReducer}) => {
	const { file, fileLoaded } = assignmentsTestFileReducer;
	return {
    file, fileLoaded
	};
};

export default connect(mapStateToProps, { assignmentsGetTestFileLocally })(CodeReview);

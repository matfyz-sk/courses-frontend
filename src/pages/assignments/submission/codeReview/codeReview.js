import React, { Component } from 'react';
import { Button, FormGroup, Label, PopoverHeader, PopoverBody, Popover, Input, Alert } from 'reactstrap';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { getFileType, getStudentName, timestampToString } from 'helperFunctions';

export default class CodeReview extends Component {
  constructor(props){
    super(props);
    this.state={

      addComment: null,
      openAddComment: false,

      newSubcomment: '',
      addSubcomment: null,

      newCodeComment: '',
      commentsLocation:null,

      showCommentMenu:null,
    }
    this.newID = 0;
    this.getNewID.bind(this);
    this.getComments.bind(this);
    this.props.setForceCloseComment( () => this.setState({addComment:null, openAddComment:false, commentsLocation:null}) )
    this.props.setForceOpenComment( (lineNumber) => {
      const comments = this.getComments(lineNumber);
      if( this.state.addComment !== null && this.state.addComment.lineNumber === lineNumber ) return;
      if(comments.length>0){
        let element = this.findElement(".react-syntax-highlighter-line-number ",lineNumber);
        this.setState(
          {
            addComment:null,
            openAddComment:false,
            commentsLocation:{
              top:element.offsetTop,
              left:element.parentElement.parentElement.offsetLeft + element.parentElement.parentElement.offsetWidth + 50,
              lineNumber
            }
          }
        );
      }else{
        this.setState({addComment:null, openAddComment:false, commentsLocation:null})
      }
    })
  }

  getNewID(){
    return this.newID ++;
  }

  getComments(lineNumber){
    return this.props.allComments.filter((comment)=>comment.filePath === this.props.currentDocument.path && lineNumber >= comment.commentedTextFrom && lineNumber <= comment.commentedTextTo);
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
        if( self.state.addComment !== null && self.state.addComment.lineNumber === lineNumber ) return;
        if(comments.length>0){
          let element = self.findElement(".react-syntax-highlighter-line-number ",lineNumber);
          self.setState(
            {
              addComment:null,
              openAddComment:false,
              commentsLocation:{
                top:element.offsetTop,
                left:element.parentElement.parentElement.offsetLeft + element.parentElement.parentElement.offsetWidth + 50,
                lineNumber
              }
            }
          );
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
          self.setState({
            openAddComment:false,
            commentsLocation:null,
            addComment:{
              position:{
                top:element.offsetTop,
                left:element.offsetLeft + element.parentElement.parentElement.offsetWidth
              },
              text:selectedText.toString(),
              element,
              lineNumber
            }
          });
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
      return { commentedTextFrom: editorLineNumber, commentedTextTo: editorLineNumber }
    }else if(topBody){
      return {commentedTextFrom : editorLineNumber - lineCount + 1, commentedTextTo: editorLineNumber }
    }
    return {commentedTextFrom : editorLineNumber, commentedTextTo: editorLineNumber + lineCount - 1 }
  }

  getCommentBy(comment){
    if(this.props.commentCreatorsVisible){
      return getStudentName(comment.createdBy)
    }
    return comment.color.name
  }


  render(){
    return(
      <div>
        <div>
          <Alert color="primary" className="mt-3 small-alert" isOpen={this.props.loadingDocument}>
            Loading file...
          </Alert>
          { this.props.currentDocument !== null &&
            <div>
              <h5>Viewing file: {this.props.currentDocument.name}</h5>
              <SyntaxHighlighter
                language={getFileType(this.props.currentDocument.fileExtension)}
                lineProps={this.perLineProps.bind(this)}
                showLineNumbers
                style={okaidia}
                wrapLines={true}
                children={this.props.currentDocument.body}
                />
            </div>
          }
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

          { this.state.openAddComment && this.props.tabID === "codeReview" && !this.props.disabled &&
            <Popover placement="right" className="bigPopover" isOpen={this.state.openAddComment} toggle={()=>{this.setState({openAddComment:false})}} target="addCodeCommentBlock">
              <PopoverHeader>Add comment</PopoverHeader>
              <PopoverBody>

                <FormGroup>
                  <Label>Commented code</Label>
                  <SyntaxHighlighter
                    language={getFileType(this.props.currentDocument.fileExtension)}
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
                      let loc = this.getCodeLocation(this.props.currentDocument.body, this.state.addComment.text, this.state.addComment.lineNumber);

                      let newCodeComment = {
                        ...loc,
                        filePath: this.props.currentDocument.path,
                        commentedText: this.state.addComment.text,
                        commentText: this.state.newCodeComment,
                      }
                      this.setState({openAddComment:false,addComment:null, newCodeComment:''})
                      this.props.addComment(newCodeComment)
                    }}
                    >
                    Add comment
                  </Button>
                </div>
              </PopoverBody>
            </Popover>
          }
          { this.state.commentsLocation!==null && this.props.tabID === "codeReview" && !this.props.disabled &&
            <Popover placement="right" className="bigPopover" isOpen={this.state.commentsLocation!==null} toggle={()=>{this.setState({commentsLocation:null})}} target="viewCodeCommentBlock">
              <PopoverHeader>Current comments</PopoverHeader>
              <PopoverBody>
                { this.getComments(this.state.commentsLocation.lineNumber).map((comment)=>
                  <div className="comment-section" key={comment['@id']}>
                    <SyntaxHighlighter
                      language={getFileType(this.props.currentDocument.fileExtension)}
                      style={okaidia}
                      children={this.state.commentsLocation===null?'':comment.commentedText}
                      />
                    <Label>Commented code by
                      <span style={{fontWeight:'bolder', color: comment.color.hex, marginLeft: '0.5rem' }}>{`${this.getCommentBy(comment)}`}</span>
                    </Label>
                    <div className="text-muted ml-auto">
                      {timestampToString(comment.createdAt)}
                    </div>
                    <p className="text-muted">
                      {comment.commentText}
                    </p>
                    { comment.childComments.map((childComment)=>
                      <div key={childComment['@id']} style={{padding:'5px 10px'}}>
                        <Label className="flex row">
                          <span style={{fontWeight:'bolder', color: childComment.color.hex }}>{`${this.getCommentBy(childComment)}`}</span>
                          <div className="text-muted ml-auto">
                            {timestampToString(childComment.createdAt)}
                          </div>
                        </Label>
                        <p className="text-muted">
                          {childComment.commentText}
                        </p>
                        <hr/>
                      </div>
                    )}
                    { this.state.addSubcomment !== comment['@id'] && <Button
                      color="link"
                      className="pull-right comment-reply-button"
                      onClick={()=>this.setState({addSubcomment:comment['@id']})}
                      >
                      <i className="fa fa-reply" /> Reply
                      </Button>}
                      {this.state.addSubcomment === comment['@id'] && <div>
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
                                commentedTextFrom: comment.commentedTextFrom,
                                commentedTextTo: comment.commentedTextTo,
                                ofComment: comment['@id'],
                                filePath: comment.filePath,
                                commentedText: comment.commentedText,
                                commentText: this.state.newSubcomment,
                              }
                              this.setState({addSubcomment:null, newSubcomment:''});
                              this.props.addComment(newSubcomment);
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

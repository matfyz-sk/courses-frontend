import React, { Component } from 'react';
import { Button, FormGroup, Label, ListGroup, ListGroupItem, Collapse, Table } from 'reactstrap';
import { connect } from "react-redux";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import classnames from 'classnames';

import {timestampToString, getFileType} from '../../../../helperFunctions';
import { assignmentsGetTestFile } from '../../../../redux/actions';

class CodeReview extends Component {
  constructor(props){
    super(props);
    this.state={
      file:null,
      openedComments:false,

      currentFolder:'',
      currentDocument:null,
      loadingDocument:false,
    }
    this.deconstructZIP.bind(this);
    this.props.assignmentsGetTestFile();
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
                <SyntaxHighlighter language={getFileType(this.state.currentDocument.fileExtension)} style={docco}>
                  {this.state.currentDocument.body}
                </SyntaxHighlighter>
              </div>
          }
            <FormGroup>
              <Label className="bold">General comments</Label>
              <div>
                Blablabla
              </div>
            </FormGroup>
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

export default connect(mapStateToProps, { assignmentsGetTestFile })(CodeReview);

import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Table } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import moment from 'moment';

import ErrorMessage from '../../../components/error';

export default class TextReview extends Component {
  constructor(props){
    super(props);
    this.setData.bind(this);
    this.removeDocument.bind(this);
  }

  setData(parameter,value){
    let newData={...this.props.data};
    newData[parameter]=value;
    this.props.setData(newData);
  }

  removeDocument(id){
    if(window.confirm('Are you sure you want to delete this document?')){
      let newDocuments=[...this.props.data.documents];
      newDocuments.splice(newDocuments.findIndex((document)=>document.id===id),1);
      this.setData('documents',newDocuments);
    }
  }

  getRealCloseTime(data){
    let deadline = moment(data.deadline).unix();
    let realCloseTime = parseInt(data.extraTime);
    if(isNaN(realCloseTime)){
      realCloseTime=0;
    }
    realCloseTime = realCloseTime*60;
    if(!isNaN(deadline)){
      realCloseTime += deadline;
    }
    return realCloseTime;
  }

  render(){
    return(
      <div>
        <h3>Info</h3>
        <div>
          <FormGroup>
            <Label for="submission-add-name">Name</Label>
            <Input type="text" id="submission-add-name" value={this.props.data.name} onChange={(e)=>this.setData('name',e.target.value)}/>
            <ErrorMessage show={this.props.data.name.length <= 4 && this.props.showErrors} message="Assignment name should be at least 5 characters!" />
          </FormGroup>
          <FormGroup>
            <Label for="submission-add-desc">Short description</Label>
              <CKEditor
                onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) }
                id="submission-add-desc"
                data={this.props.data.shortDescription}
                onChange={(e)=>this.setData('shortDescription',e.editor.getData())}
                config={{
                    height: [ '5em' ],
                    codeSnippet_languages: {
                      javascript: 'JavaScript',
                      php: 'PHP'
                    }
                }}
              />
          </FormGroup>
          <FormGroup>
            <Label for="submission-add-desc">Full description</Label>
              <CKEditor
                onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) }
                id="submission-add-desc"
                data={this.props.data.description}
                onChange={(e)=>this.setData('description',e.editor.getData())}
                config={{
                    height: [ '10em' ],
                    codeSnippet_languages: {
                      javascript: 'JavaScript',
                      php: 'PHP'
                    }
                }}
              />
          </FormGroup>
          <h4>Documents</h4>
            <Button size="sm" color="success">
              <i className="fa fa-plus clickable" />
              Add document
            </Button>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>URL</th>
                  <th>
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.documents.map((document)=>
                  <tr key={document.id}>
                    <th scope="row">{document.id}</th>
                    <td>{document.name}</td>
                    <td><a href={document.url}>{document.url}</a></td>
                    <td>
                      <Button size="sm" color="" onClick={()=>this.removeDocument(document.id)}>
                        <i className="fa fa-times clickable" />
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
        </div>


      </div>
    )
  }
}

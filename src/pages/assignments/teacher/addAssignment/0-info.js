import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Table } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import moment from 'moment';

import ErrorMessage from '../../../../components/error';

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
          <h4>Submission</h4>
          <FormGroup check>
            <Label check>
              <Input type="checkbox" id="checkbox2" checked={this.props.data.improvedSubmission} onChange={()=>this.setData('improvedSubmission',!this.props.data.improvedSubmission)} disabled={this.props.data.disabled}/> {' '}
                Improved submission
              </Label>
            </FormGroup>
          <div className="flex-row">
            <div className="flex-clumn" className="flex-clumn mr-2" style={{width:'50%'}}>
              <FormGroup>
                <Label htmlFor="submission-add-openTime">Open time</Label>
                <Input id="submission-add-openTime" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.openTime} onChange={(e)=>this.setData('openTime',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime===''} message="You must pick an open time!" />
              <FormGroup>
                <Label htmlFor="submission-add-deadline">Deadline</Label>
                <Input id="submission-add-deadline" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.deadline} onChange={(e)=>this.setData('deadline',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.deadline === '' } message="You must pick the deadline!" />
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.openTime !== '' && this.props.data.deadline !== '' && moment(this.props.data.openTime).unix() > moment(this.props.data.deadline).unix() } message="Open time is later than deadline!" />
              <FormGroup>
                <Label htmlFor="submission-add-extraTime">Extra time (in minutes)</Label>
                <Input id="submission-add-extraTime" type="number" disabled={this.props.data.disabled} value={this.props.data.extraTime} onChange={(e)=>this.setData('extraTime',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.extraTime)) || parseInt(this.props.data.extraTime) < 0)} message="Extra time is not an number or negative!" />
            </div>
            {this.props.data.improvedSubmission && <div className="flex-clumn ml-2" style={{width:'50%'}}>
              <FormGroup>
                <Label htmlFor="submission-add-improvedOpenTime">Open time</Label>
                <Input id="submission-add-improvedOpenTime" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.improvedOpenTime} onChange={(e)=>this.setData('improvedOpenTime',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime===''} message="You must pick an open time!" />
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime!=='' && this.getRealCloseTime(this.props.data) > moment(this.props.data.improvedOpenTime).unix()} message="Improved open time must be after deadline!" />
              <FormGroup>
                <Label htmlFor="submission-add-improvedDeadline">Deadline</Label>
                <Input id="submission-add-improvedDeadline" type="datetime-local" disabled={this.props.data.disabled} value={this.props.data.improvedDeadline} onChange={(e)=>this.setData('improvedDeadline',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedDeadline===''} message="You must pick the deadline!" />
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && this.props.data.improvedOpenTime !== '' && this.props.data.improvedDeadline !== '' && moment(this.props.data.improvedOpenTime).unix() > moment(this.props.data.improvedDeadline).unix() } message="Open time is later than deadline!" />
              <FormGroup>
                <Label htmlFor="submission-add-improvedExtraTime">Extra time (in minutes)</Label>
                <Input id="submission-add-improvedExtraTime" type="number" disabled={this.props.data.disabled} value={this.props.data.improvedExtraTime} onChange={(e)=>this.setData('improvedExtraTime',e.target.value)}/>
              </FormGroup>
              <ErrorMessage show={this.props.showErrors && !this.props.data.disabled && (isNaN(parseInt(this.props.data.improvedExtraTime)) || parseInt(this.props.data.improvedExtraTime) < 0)} message="Extra time is not an number or negative!" />
            </div>}

          </div>
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

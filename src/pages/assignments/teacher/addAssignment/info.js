import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Table } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TextTeview extends Component {
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

  render(){
    return(
      <div>
        <h3>Info</h3>
        <div>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="text" id="name" value={this.props.data.name} onChange={(e)=>this.setData('name',e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="desc">Short description</Label>
              <CKEditor
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
              <FontAwesomeIcon
                icon="plus"
                className="clickable center-hor"
                /> Add document
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
                  <tr>
                    <th scope="row">{document.id}</th>
                    <td>{document.name}</td>
                    <td><a href={document.url}>{document.url}</a></td>
                    <td>
                      <Button size="sm" color="" onClick={()=>this.removeDocument(document.id)}>
                        <FontAwesomeIcon
                          icon="times"
                          className="clickable center-hor"
                          />
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

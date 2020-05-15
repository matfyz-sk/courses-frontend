import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Table, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import moment from 'moment';

import ErrorMessage from 'components/error';
import AddNewMaterial from './material/newMaterial';
import AddExistingMaterial from './material/existingMaterial';

export default class TextReview extends Component {
  constructor(props){
    super(props);
    this.state = {
        addingExistingMaterial: false,
        addingNewMaterial: false,
    }
    this.setData.bind(this);
    this.deleteMaterial.bind(this);
  }

  setData(parameter,value){
    let newData={...this.props.data};
    newData[parameter]=value;
    this.props.setData(newData);
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

  deleteMaterial(material){
    if(window.confirm(`Are you sure you want to delete question "${material.name}" ?`)){
      this.props.deleteMaterial(material);
    }
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
                onChange={(e)=>this.setData('shortDescription',e.editor.getData()+"")}
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
                onChange={(e)=>this.setData('description',e.editor.getData()+"")}
                config={{
                    height: [ '10em' ],
                    codeSnippet_languages: {
                      javascript: 'JavaScript',
                      php: 'PHP'
                    }
                }}
              />
          </FormGroup>
          <h4>Materials</h4>

          <Button size="sm" className="m-2" id="addingExistingMaterialButton" color="primary" onClick={()=> this.setState({ addingExistingMaterial: true }) }>
            <i className="fa fa-plus clickable" />
            Add existing materials
          </Button>

          <Popover
            placement='right'
            isOpen={ this.state.addingExistingMaterial }
            target={"addingExistingMaterialButton"}
            toggle={ () => this.setState({ addingExistingMaterial: false }) }
            className="popover-700 popover-max-height-700"
            >
            <PopoverHeader>Adding existing materials</PopoverHeader>
            <PopoverBody>
              <AddExistingMaterial
                allMaterials = { this.props.allMaterials }
                selectedMaterials = { this.props.data.hasMaterial }
                addMaterial={ (material) => {
                  this.props.addMaterial(material);
                }}
                closePopover={ () => this.setState({ addingExistingMaterial: false }) }
                />
            </PopoverBody>
          </Popover>


          <Button size="sm" className="m-2 m-l-10" color="success" id="addingNewMaterialButton" onClick={()=> this.setState({ addingNewMaterial: true }) }>
            <i className="fa fa-plus clickable" />
            Add new material
          </Button>
          <Popover
            placement='right'
            isOpen={ this.state.addingNewMaterial }
            target={"addingNewMaterialButton"}
            className="popover-500"
            toggle={ () => this.setState({ addingNewMaterial: false }) }
          >
            <PopoverHeader>Adding new material</PopoverHeader>
            <PopoverBody>
              <AddNewMaterial
                addMaterial={ (material) => {
                  this.setState({ addingNewMaterial: false });
                  this.props.addMaterial(material);
                }}
                closePopover={ () => this.setState({ addingNewMaterial: false }) }
              />
            </PopoverBody>
          </Popover>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>URL</th>
                  <th width="75">Is new</th>
                  <th width="20">
                  </th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.hasMaterial.map((material)=>
                  <tr key={material['@id']}>
                    <td>{ material.name }</td>
                    <td><a href={material.URL} target="_blank" without="true" rel="noopener noreferrer">{ material.URL }</a></td>
                    <td style={{ textAlign: 'center' }}>{ material.new ? <i className="fa fa-check green-color" /> : <i className="fa fa-times light-red-color" /> }</td>
                    <td>
                      <Button size="sm" color=""  className="center-ver" onClick={()=>this.deleteMaterial(material)}>
                        <i className="fa fa-trash clickable red-color" />
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

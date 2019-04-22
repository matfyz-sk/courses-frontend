import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText, Table, InputGroup, InputGroupAddon } from 'reactstrap';
import RichTextEditor from "react-rte";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'title',value:'title'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

const selectStyle2 = {
  control: styles => ({ ...styles, width: 150 }),
};

export default class Attributes extends Component {
  constructor(props){
    super(props);
    this.state={
      input1:'Custom input',
      input2:'Custom input 2',

    }
  }

  render(){
    return(
      <div>
        <h3>Submission form configuration</h3>
        <div>
          <FormGroup className="row mt-2">
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
              <Input type="text" name="text" id="q2"/>
            </InputGroup>
            <InputGroup className="col-5">
              <InputGroupAddon addonType="prepend">Description</InputGroupAddon>
              <Input type="text" name="text" id="q2" placeholder="description" />
            </InputGroup>
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Type</InputGroupAddon>
              <Select options={inputTypes} styles={selectStyle2}  />
            </InputGroup>
            <div className="col-1">
              <Button color="success">Add</Button>
            </div>
          </FormGroup>

          <FormGroup className="row mt-2">
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
              <Input type="text" name="text" id="q2" value={this.state.input1} onChange={(e)=>this.setState({input1:e.target.value})} />
            </InputGroup>
            <InputGroup className="col-5">
              <InputGroupAddon addonType="prepend">Description</InputGroupAddon>
              <Input type="text" name="text" id="q2" placeholder="description" />
            </InputGroup>
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Type</InputGroupAddon>
              <Select options={inputTypes} styles={selectStyle2}  />
            </InputGroup>
            <div className="col-1">
              <Button style={{marginLeft:'auto'}} color="danger">Delete</Button>
            </div>
          </FormGroup>
          <FormGroup className="row mt-2">
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Name</InputGroupAddon>
              <Input type="text" name="text" id="q2" value={this.state.input2} onChange={(e)=>this.setState({input2:e.target.value})} />
            </InputGroup>
            <InputGroup className="col-5">
              <InputGroupAddon addonType="prepend">Description</InputGroupAddon>
              <Input type="text" name="text" id="q2" placeholder="description" />
            </InputGroup>
            <InputGroup className="col-3">
              <InputGroupAddon addonType="prepend">Type</InputGroupAddon>
              <Select options={inputTypes} styles={selectStyle2}  />
            </InputGroup>
            <div className="col-1">
              <Button style={{marginLeft:'auto'}} color="danger">Delete</Button>
            </div>
          </FormGroup>

        </div>
      </div>
    )
  }
}

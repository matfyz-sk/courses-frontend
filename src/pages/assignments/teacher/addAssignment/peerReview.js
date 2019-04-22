import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText,InputGroup, InputGroupAddon } from 'reactstrap';
import RichTextEditor from "react-rte";
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

export default class PeerReview extends Component {
  constructor(props){
    super(props);
    this.state={
      description: RichTextEditor.createValueFromString("", "html"),
      input1:'Custom input',
      input2:'Custom input 2',
      disabled:false
    }
  }

  render(){
    return(
      <div>
        <h3>Peer review</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" id="checkbox2" checked={this.state.disabled} onChange={()=>this.setState({disabled:!this.state.disabled})} /> {' '}
            Disabled
          </Label>
        </FormGroup>

        <div className="row">
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio2" disabled={this.state.disabled}/>{' '}
              Team
            </Label>
          </FormGroup>
          <FormGroup check style={{marginLeft:20}}>
            <Label check>
              <Input type="radio" name="radio2" disabled={this.state.disabled}/>{' '}
              Single
            </Label>
          </FormGroup>
        </div>

        <Label>
          Size of a team
        </Label>
        <FormGroup className="row mt-2">
          <InputGroup className="col-6">
            <InputGroupAddon addonType="prepend">Min</InputGroupAddon>
            <Input type="text" name="text" id="q2" disabled={this.state.disabled}/>
          </InputGroup>
          <InputGroup className="col-6">
            <InputGroupAddon addonType="prepend">Max</InputGroupAddon>
            <Input type="text" name="text" id="q2" disabled={this.state.disabled}/>
          </InputGroup>
        </FormGroup>

        <FormGroup check>
        <Label check>
          <Input type="checkbox" id="checkbox2" disabled={this.state.disabled}/> {' '}
          Multiple submissions
        </Label>
      </FormGroup>
        </div>

      </div>
    )
  }
}

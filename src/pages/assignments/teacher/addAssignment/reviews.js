import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText,InputGroup, InputGroupAddon } from 'reactstrap';
import RichTextEditor from "react-rte";
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

export default class Reviews extends Component {
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
        <h3>Review</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" id="checkbox2" checked={this.state.disabled} onChange={()=>this.setState({disabled:!this.state.disabled})} /> {' '}
            Disabled
          </Label>
        </FormGroup>
        <hr/>
        <FormGroup>
          <Label>Open time</Label>
          <Input type="datetime-local" disabled={this.state.disabled}/>
        </FormGroup>
        <FormGroup>
          <Label>Deadline</Label>
          <Input type="datetime-local" disabled={this.state.disabled}/>
        </FormGroup>
        <FormGroup>
          <Label>Extra time (in minutes)</Label>
          <Input type="number" disabled={this.state.disabled}/>
        </FormGroup>
        <FormGroup>
          <Label>Number of reviews per submission</Label>
          <Input type="number" disabled={this.state.disabled}/>
        </FormGroup>
        <hr/>

        <div className="row">
          <Label style={{paddingRight:5}}>Reviewed by:</Label>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio2" disabled={this.state.disabled}/>{' '}
              Team
            </Label>
          </FormGroup>
          <FormGroup check style={{marginLeft:20}}>
            <Label check>
              <Input type="radio" name="radio2" disabled={this.state.disabled}/>{' '}
              Individual
            </Label>
          </FormGroup>
        </div>

        <div className="row">
          <Label style={{paddingRight:5}}>Visibility of review:</Label>
          <FormGroup check>
            <Label check>
              <Input type="radio" name="radio1" disabled={this.state.disabled}/>{' '}
              Open
            </Label>
          </FormGroup>
          <FormGroup check style={{marginLeft:20}}>
            <Label check>
              <Input type="radio" name="radio1" disabled={this.state.disabled}/>{' '}
              Blind
            </Label>
          </FormGroup>
          <FormGroup check style={{marginLeft:20}}>
            <Label check>
              <Input type="radio" name="radio1" disabled={this.state.disabled}/>{' '}
              Double blind
            </Label>
          </FormGroup>
        </div>

        </div>

      </div>
    )
  }
}

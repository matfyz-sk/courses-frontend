import React, { Component } from 'react';
import { FormGroup, Label, Input } from 'reactstrap';
import RichTextEditor from "react-rte";

export default class Teams extends Component {
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
        <h3>Teams</h3>
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
              Individual
            </Label>
          </FormGroup>
        </div>

        <FormGroup>
          <Label>Size of a team min</Label>
          <Input type="number" disabled={this.state.disabled}/>
        </FormGroup>
        <FormGroup>
          <Label>Size of a team max</Label>
          <Input type="number" disabled={this.state.disabled}/>
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

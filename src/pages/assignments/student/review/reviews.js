import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, FormText } from 'reactstrap';


export default class TextTeview extends Component {
  constructor(props){
    super(props);
    this.state={
    }
  }

  render(){
    return(
      <div>
        <div className="submissionContainer bottomSeparator">
          <h4>Odovzdané</h4>
          <FormGroup>
            <Label className="bold">Text area</Label>
            <div>Here will be the submitted multiple line text</div>
          </FormGroup>
          <FormGroup>
            <Label className="bold mr-2">File</Label>
            <a href="https://www.google.com">Google</a>
            <FormText color="muted">
              This is some placeholder block-level help text for the above input.
              It's a bit lighter and easily wraps to a new line.
            </FormText>
          </FormGroup>
          </div>
        <div>
          <FormGroup>
            <Label for="q1">Question 1</Label>
            <Input type="textarea" name="text" id="q1" />
          </FormGroup>
          <FormGroup>
            <Label for="q2">Question 2</Label>
            <Input type="textarea" name="text" id="q2" />
          </FormGroup>
          <FormGroup>
            <Label for="q2">Message for teacher only</Label>
            <Input type="textarea" name="text" id="q2" />
          </FormGroup>
        </div>

        <Button color="success">Save review</Button>
      </div>
    )
  }
}

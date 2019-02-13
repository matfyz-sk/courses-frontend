import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, FormText } from 'reactstrap';

import {timestampToString} from '../../../../../helperFunctions';

const submissions = [
  {id:2,title:'Submission 3',active:true, deadline:1604047500,body:'AAH' },
  {id:1,title:'Submission 2',active:false, deadline:1549788300, body:'BBB' },
  {id:0,title:'Submission 1',active:false, deadline:1547109900, body:'CCC' },
]

export default class ViewReview extends Component{
  constructor(props){
    super(props);
    this.state={
      open:false,
      submission:submissions.find((item)=>item.id===this.props.id)
    }
  }

  toggle(){
    this.setState({open:!this.state.open})
  }

  render(){
    return(
      <div>
        {
          this.state.submission.active?
          <Button color="success" onClick={this.toggle.bind(this)}>Edit</Button>
          :
          <Button color="primary" onClick={this.toggle.bind(this)}>View</Button>
        }
        <Modal isOpen={this.state.open} className="modal-customs">
          <ModalHeader toggle={this.toggle.bind(this)}>{this.state.submission.active?'Editing':'Viewing'} submission</ModalHeader>
          <ModalBody>
            <h2>Zadanie úlohy</h2>
            <FormGroup>
              <Label>Deadline: </Label>  {timestampToString(this.state.submission.deadline)}
            </FormGroup>
            {this.state.submission.body}
            <h2>Odovzdanie úlohy</h2>
            <FormGroup>
              <Label for="exampleText">Text Area</Label>
              <Input type="textarea" name="text" id="exampleText" />
            </FormGroup>
            <FormGroup>
              <Label for="exampleFile">File</Label>
              <Input type="file" name="file" id="exampleFile" />
              <FormText color="muted">
                This is some placeholder block-level help text for the above input.
                It's a bit lighter and easily wraps to a new line.
              </FormText>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle.bind(this)}>Save</Button>
            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

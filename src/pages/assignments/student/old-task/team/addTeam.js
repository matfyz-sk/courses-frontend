import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
export default class AddTeam extends Component{
  constructor(props){
    super(props);
    this.state={
      open:false,
      title:'',
      students:[{value:0,label:'Patricny'},{value:1,label:'Haradon'},{value:2,label:'Pestrak'}],
      teammates:[]
    }
  }

  toggle(){
    this.setState({open:!this.state.open})
  }

  render(){
    return(
      <div>
        <Button color="success" onClick={this.toggle.bind(this)}>Add team</Button>
        <Modal isOpen={this.state.open} toggle={this.toggle.bind(this)}>
          <ModalHeader toggle={this.toggle.bind(this)}>Adding new team</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="teamName">Team name</Label>
              <Input type="text" id="teamName" value={this.state.title} placeholder="Enter team name" onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label for="teammates">Select your teammates</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.students}
                isMulti
                value={this.state.teammates}
                onChange={e =>{ this.setState({ teammates: e }); }}
                />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggle.bind(this)}>Add</Button>
            <Button color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText,InputGroup, InputGroupAddon, Table } from 'reactstrap';
import RichTextEditor from "react-rte";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

export default class TeamReview extends Component {
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
        <h3>Team review</h3>
        <div>
          <FormGroup check>
          <Label check>
            <Input type="checkbox" id="checkbox2" checked={this.state.disabled} onChange={()=>this.setState({disabled:!this.state.disabled})} /> {' '}
            Disabled
          </Label>
        </FormGroup>
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

        <Button size="sm" color="success">
          <FontAwesomeIcon
            icon="plus"
            className="clickable center-hor"
            /> Add questions
        </Button>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Question 1</td>
              <td>
                <Button size="sm" color="">
                  <FontAwesomeIcon
                    icon="times"
                    className="clickable center-hor"
                    />
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Question 2</td>
                <td>
                <Button size="sm" color="">
                  <FontAwesomeIcon
                    icon="times"
                    className="clickable center-hor"
                    />
                </Button>
              </td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Question 3</td>
                <td>
                <Button size="sm" color="">
                  <FontAwesomeIcon
                    icon="times"
                    className="clickable center-hor"
                    />
                </Button>
              </td>
            </tr>

          </tbody>
        </Table>

        </div>

      </div>
    )
  }
}

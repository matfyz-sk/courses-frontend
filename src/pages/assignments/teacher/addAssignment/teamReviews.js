import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText } from 'reactstrap';
import RichTextEditor from "react-rte";
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

export default class TeamReviews extends Component {
  constructor(props){
    super(props);
    this.state={
      description: RichTextEditor.createValueFromString("", "html"),
      input1:'Custom input',
      input2:'Custom input 2',

    }
  }

  render(){
    return(
      <div>
        <h3>Team reviews</h3>
        <div>
          <FormGroup>
            <Label for="q1">Short description</Label>
            <Input type="textarea" name="text" id="q1" />
          </FormGroup>
          <FormGroup>
            <Label for="q2">Assignment body</Label>
            <RichTextEditor
              value={this.state.description}
              onChange={e => {
                this.setState({ description: e });
              }}
              placeholder="Enter assignment body"
              toolbarClassName="demo-toolbar"
              editorClassName="demo-editor"
              />
          </FormGroup>
          <div className="row" style={{marginBottom:15}}>
            <Select options={inputTypes} styles={selectStyle}  />
            <Input style={{width:'auto',marginLeft:15}} type="text" name="text" id="q2" placeholder="Field name" />
            <Button style={{marginLeft:15}} color="success">Add field</Button>
          </div>
          <FormGroup>
            <Input style={{width:'auto', border:'none'}} type="text" name="text" id="q2" value={this.state.input1} onChange={(e)=>this.setState({input1:e.target.value})} />
            <Input type="text" name="text" id="q2" />
          </FormGroup>
          <FormGroup>
            <Input style={{width:'auto', border:'none'}} type="text" name="text" id="q2" value={this.state.input2} onChange={(e)=>this.setState({input2:e.target.value})} />
            <Input type="textarea" name="text" id="q2" />
          </FormGroup>
        </div>

        <Button color="success">Add assignment</Button>
      </div>
    )
  }
}

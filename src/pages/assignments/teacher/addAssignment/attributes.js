import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText, Table, InputGroup, InputGroupAddon, CardTitle } from 'reactstrap';
import RichTextEditor from "react-rte";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'title',value:'title'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const attributes = [{name:'Custom input 1',description:'Desc',type:{label:'text area',value:'text area'}},{name:'Custom input 2',description:'Desc',type:{label:'title',value:'title'}}]

const selectStyle = {
  control: styles => ({ ...styles }),
};

const selectStyle2 = {
  control: styles => ({ ...styles }),
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
          <Card>
            <CardHeader>Add attribute</CardHeader>
          <CardBody>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text"/>
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input type="textarea"/>
            </FormGroup>
            <FormGroup>
              <Label>Type</Label>
              <Select options={inputTypes} styles={selectStyle2}  />
            </FormGroup>
            <Button style={{marginLeft:'auto'}} color="success">Add attribute</Button>
          </CardBody>
        </Card>

          {/*END OF ADDING*/}

          {
            attributes.map((attribute)=>
            <Card style={{marginTop:15}}>
              <CardHeader>Add attribute</CardHeader>
            <CardBody>
              <FormGroup>
                <Label>Name</Label>
                <Input type="text" value={attribute.name}/>
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" value={attribute.description}/>
              </FormGroup>
              <FormGroup>
                <Label>Type</Label>
                <Select options={inputTypes} styles={selectStyle2} value={attribute.type} />
              </FormGroup>
              <Button style={{marginLeft:'auto'}} onClick={()=>window.confirm("Are you sure?")} color="danger">Delete attribute</Button>
            </CardBody>
          </Card>
        )}

        </div>
      </div>
    )
  }
}

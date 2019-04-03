import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import RichTextEditor from "react-rte";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'title',value:'title'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]

const selectStyle = {
  control: styles => ({ ...styles, width: 250 }),
};

export default class TextTeview extends Component {
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
        <h3>Info</h3>
        <div>
          <FormGroup>
            <Label for="q1">Name</Label>
            <Input type="textarea" name="text" id="q1" />
          </FormGroup>
          <FormGroup>
            <Label for="q1">Short description</Label>
            <Input type="textarea" name="text" id="q1" />
          </FormGroup>
          <h4>Documents</h4>
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>URL</th>
                  <th>
                    <Button size="sm" color="">
                      <FontAwesomeIcon
                        icon="plus"
                        className="clickable center-hor"
                        />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Document 1</td>
                  <td><a href="https://www.google.com/search?q=semantika">{"https://www.google.com/search?q=semantika"}</a></td>
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
                  <td>Document 2</td>
                    <td><a href="https://www.google.com/search?q=matematika">{"https://www.google.com/search?q=matematika"}</a></td>
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
                  <td>Document 3</td>
                    <td><a href="https://www.google.com/search?q=logika">{"https://www.google.com/search?q=logika"}</a></td>
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
          <div className="row" style={{marginBottom:15,marginTop:15}}>
            <Input style={{width:'auto',marginLeft:15}} type="text" name="text" id="q2" placeholder="Label" />
            <Select options={inputTypes} styles={selectStyle}  />
            <Input style={{width:'auto',marginLeft:15}} type="text" name="text" id="q2" placeholder="Description" />
            <Button style={{marginLeft:15}} color="success">Add field</Button>
          </div>
          <FormGroup>
            <Input style={{width:'auto', border:'none'}} type="text" name="text" id="q2" value={this.state.input1} onChange={(e)=>this.setState({input1:e.target.value})} />
            <Input type="text" name="text" id="q2" style={{margin:'5px 0px'}} placeholder="description" />
            <Input type="text" name="text" id="q2" />
          </FormGroup>
          <FormGroup>
            <Input style={{width:'auto', border:'none'}} type="text" name="text" id="q2" value={this.state.input2} onChange={(e)=>this.setState({input2:e.target.value})} />
            <Input type="text" name="text" id="q2" style={{margin:'5px 0px'}} placeholder="description" />
            <Input type="textarea" name="text" id="q2" />
          </FormGroup>
        </div>


      </div>
    )
  }
}

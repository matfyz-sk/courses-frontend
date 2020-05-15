import React, { Component } from 'react';
import { Label, Input, Button, FormGroup } from 'reactstrap';
import { Alert } from 'reactstrap';
import ErrorMessage from 'components/error';

export default class AddMaterial extends Component{

  constructor(props){
    super(props);
    this.state = {
      name: '',
      URL: '',
      showErrors:false
    }
  }

  addMaterial(){
    this.setState({ showErrors: false })
    if(this.state.name.length <= 4 || this.state.URL.length <= 1 ){
      this.setState({ showErrors:true });
      return;
    }
    let material = {
      name: this.state.name,
      URL: this.state.URL,
    }
    this.props.addMaterial(material);
    this.setState({
      name: '',
      URL: ''
     })
  }

  render(){
    return(
      <div>
        <FormGroup>
          <Label for="new-material-name">Name</Label>
          <Input type="text" id="new-material-name" value={this.state.name} onChange={(e)=>this.setState({ name: e.target.value })} />
          <ErrorMessage show={this.state.name.length <= 4 && this.state.showErrors} message="Name should be at least 5 characters!" />
        </FormGroup>
        <FormGroup>
          <Label for="new-material-url">URL</Label>
          <Input type="url" id="new-material-url" value={this.state.URL} onChange={(e)=>this.setState({ URL: e.target.value })} />
          <ErrorMessage show={this.state.URL.length <= 1 && this.state.showErrors} message="You must set materials address!" />
        </FormGroup>
        <Alert color="info" className="small-alert">
          Only materials that were assigned to the assignment will be saved!
        </Alert>
        <Button outline size="sm" className="m-2 m-r-285" color="secondary" onClick={ this.props.closePopover }>
          Close
        </Button>
        <Button size="sm" className="m-2" color="success" onClick={ this.addMaterial.bind(this) }>
          <i className="fa fa-plus clickable" />
          Add material
        </Button>
      </div>
    )
  }
}

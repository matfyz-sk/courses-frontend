import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, FormGroup, Input, Label } from 'reactstrap';
import Select from 'react-select';
import CKEditor from 'ckeditor4-react';

import ErrorMessage from 'components/error';

export default class Fields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      type: null,
      newID: this.props.data.fields.length
    }
    this.getNewID.bind(this);
  }

  getNewID() {
    let newID = this.state.newID;
    this.setState({newID: newID + 1});
    return newID;
  }

  addField() {
    let newField = {
      id: this.getNewID(),
      title: this.state.title,
      description: this.state.description,
      type: this.state.type
    };
    this.setState({
      title: '',
      description: '',
      type: null
    })
    this.props.setData({...this.props.data, fields: [ ...this.props.data.fields, newField ]});
  }

  removeField(id) {
    if(window.confirm('Are you sure you want to delete this field?')) {
      let newFields = [ ...this.props.data.fields ];
      newFields.splice(newFields.findIndex((field) => field.id === id), 1);
      this.props.setData({...this.props.data, fields: newFields});
    }
  }

  setData(parameter, value, id) {
    let newFields = [ ...this.props.data.fields ];
    let field = newFields.find((item) => item.id === id);
    field[parameter] = value;
    this.props.setData({...this.props.data, newFields});
  }

  render() {
    let inputTypes = [ {label: 'input', value: 'input'}, {label: 'text area', value: 'text area'}, {
      label: 'title',
      value: 'title'
    }, {label: 'File (for code review)', value: 'codeReview'}, {label: 'file', value: 'file'}, {
      label: 'Link (URL)',
      value: 'Link (URL)'
    }, {label: 'Rich text', value: 'Rich text'} ]
    if(this.props.data.fields.some((field) => field.type.value === 'title')) {
      inputTypes.splice(inputTypes.findIndex((type) => type.value === 'title'), 1);
    }
    if(this.props.data.fields.some((field) => field.type.value === 'codeReview')) {
      inputTypes.splice(inputTypes.findIndex((type) => type.value === 'codeReview'), 1);
    }
    return (
      <div>
        <h3>Submission form configuration</h3>
        <ErrorMessage show={ this.props.data.fields.length === 0 && this.props.showErrors }
                      message="There must be at least one submission field!"/>
        <div>
          <Card>
            <CardHeader>Add field</CardHeader>
            <CardBody>
              <FormGroup>
                <Label htmlFor="submission-add-title">Name</Label>
                <Input id="submission-add-title" type="text" value={ this.state.title }
                       onChange={ (e) => this.setState({title: e.target.value}) }/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="submission-add-description">Description</Label>
                <CKEditor
                  id="submission-add-description"
                  onBeforeLoad={ (CKEDITOR) => (CKEDITOR.disableAutoInline = true) }
                  data={ this.state.description }
                  onChange={ (e) => this.setState({description: e.editor.getData()}) }
                  config={ {
                    height: [ '5em' ],
                    codeSnippet_languages: {
                      javascript: 'JavaScript',
                      php: 'PHP'
                    }
                  } }
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="submission-add-type">Type</Label>
                <Select
                  id="submission-add-type"
                  options={ inputTypes }
                  value={ this.state.type }
                  onChange={ (type) => this.setState({type}) }
                />
              </FormGroup>
              <Button style={ {marginLeft: 'auto'} } disabled={ this.state.title === '' || this.state.type === null }
                      color="success" onClick={ this.addField.bind(this) }>Add field</Button>
            </CardBody>
          </Card>

          {
            this.props.data.fields.map((field) =>
              <Card style={ {marginTop: 15} } key={ field.id }>
                <CardHeader>{ field.title }</CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label htmlFor={ "submission-add-title" + field.id }>Title</Label>
                    <Input id={ "submission-add-title" + field.id } type="text" value={ field.title }
                           onChange={ (e) => this.setData('title', e.target.value, field.id) }/>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={ "submission-add-description" + field.id }>Description</Label>
                    <CKEditor
                      id={ "submission-add-description" + field.id }
                      onBeforeLoad={ (CKEDITOR) => (CKEDITOR.disableAutoInline = true) }
                      data={ field.description }
                      onChange={ (e) => this.setData('description', e.editor.getData(), field.id) }
                      config={ {
                        height: [ '3em' ],
                        codeSnippet_languages: {
                          javascript: 'JavaScript',
                          php: 'PHP'
                        }
                      } }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor={ "submission-add-type" + field.id }>Type</Label>
                    <Select
                      id={ "submission-add-type" + field.id }
                      options={ inputTypes }
                      value={ field.type }
                      onChange={ (type) => this.setData('type', type, field.id) }
                    />
                  </FormGroup>
                  <Button style={ {marginLeft: 'auto'} } onClick={ () => this.removeField(field.id) } color="danger">Delete
                    field</Button>
                </CardBody>
              </Card>
            ) }

        </div>
      </div>
    )
  }
}

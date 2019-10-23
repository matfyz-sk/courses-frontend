import React, { Component } from 'react';
import { CardBody, Card, CardHeader, Button, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import CKEditor from 'ckeditor4-react';

export default class Attributes extends Component {
  constructor(props){
    super(props);
    this.state={
      title:'',
      description:'',
      type:null,
      newID:2
    }
    this.getNewID.bind(this);
  }

  getNewID(){
    let newID = this.state.newID;
    this.setState({newID:newID+1});
    return newID;
  }

  addAttribute(){
    let newAttribute={id:this.getNewID(),title:this.state.title,description:this.state.description,type:this.state.type,isTitle:this.state.type.value==='title'};
    this.setState({
      title:'',
      description:'',
      type:null
    })
    this.props.setData({...this.props.data,attributes:[...this.props.data.attributes,newAttribute]});
  }

  removeAttribute(id){
    if(window.confirm('Are you sure you want to delete this attribute?')){
      let newAttributes=[...this.props.data.attributes];
      newAttributes.splice(newAttributes.findIndex((attribute)=>attribute.id===id),1);
      this.props.setData({...this.props.data,attributes:newAttributes});
    }
  }

  setData(parameter,value,id){
    let newAttributes=[...this.props.data.attributes];
    let attribute = newAttributes.find((item)=>item.id===id);
    attribute[parameter]=value;
    if(parameter==='type'){
      attribute.isTitle=value.value==='title';
    }
    this.props.setData({...this.props.data,newAttributes});
  }

  render(){
    let inputTypes = [{label:'input',value:'input'},{label:'text area',value:'text area'},{label:'title',value:'title'},{label:'file',value:'file'},{label:'Link (URL)',value:'Link (URL)'},{label:'Rich text',value:'Rich text'}]
    if(this.props.data.attributes.some((attribute)=>attribute.isTitle||(this.state.type!==null && this.state.type.value==='title'))){
      inputTypes.splice(inputTypes.findIndex((type)=>type.value==='title'),1);
    }
    return(
      <div>
        <h3>Submission form configuration</h3>
        <div>
          <Card>
            <CardHeader>Add attribute</CardHeader>
          <CardBody>
            <FormGroup>
              <Label htmlFor="title">Name</Label>
              <Input id="title" type="text" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})}/>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Description</Label>
                <CKEditor
                  id="description"
                  data={this.state.description}
                  onChange={(e)=>this.setState({description:e.editor.getData()})}
                  config={{
                      height: [ '10em' ],
                      codeSnippet_languages: {
                        javascript: 'JavaScript',
                        php: 'PHP'
                      }
                  }}
                />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="type">Type</Label>
                <Select
                  id="type"
                  options={inputTypes}
                  value={this.state.type}
                  onChange={(type) => this.setState({ type })}
                  />
            </FormGroup>
            <Button style={{marginLeft:'auto'}} disabled={this.state.title===''||this.state.type===null} color="success" onClick={this.addAttribute.bind(this)}>Add attribute</Button>
          </CardBody>
        </Card>

          {
            this.props.data.attributes.map((attribute)=>
            <Card style={{marginTop:15}} key={attribute.id}>
              <CardHeader>{attribute.title}</CardHeader>
            <CardBody>
              <FormGroup>
                <Label htmlFor={"title"+attribute.id}>Title</Label>
                <Input id={"title"+attribute.id} type="text" value={attribute.title} onChange={(e)=>this.setData('title',e.target.value,attribute.id)}/>
              </FormGroup>
              <FormGroup>
                <Label htmlFor={"description"+attribute.id}>Description</Label>
                  <CKEditor
                    id={"description"+attribute.id}
                    data={attribute.description}
                    onChange={(e)=>this.setData('description',e.editor.getData(),attribute.id)}
                    config={{
                        height: [ '3em' ],
                        codeSnippet_languages: {
                          javascript: 'JavaScript',
                          php: 'PHP'
                        }
                    }}
                  />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    options={inputTypes}
                    value={attribute.type}
                    onChange={(type)=>this.setData('type',type,attribute.id)}
                    />
              </FormGroup>
              <Button style={{marginLeft:'auto'}} onClick={()=>this.removeAttribute(attribute.id)} color="danger">Delete attribute</Button>
            </CardBody>
          </Card>
        )}

        </div>
      </div>
    )
  }
}

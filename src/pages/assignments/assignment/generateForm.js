import React from 'react';
import { FormGroup, Label, Input, FormText } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import ErrorMessage from '../../components/error';

export const generateField = (field,state, onChange) => {
  let onChangeWithTaget=(event)=>{
    let data = {...state.data};
    data[field.id] = event.target.value;
    onChange(data);
  }

  let onChangeWithoutTaget=(value)=>{
    let data = {...state.data};
    data[field.id] = value;
    onChange(data);
  }

  let onChangeWithFile=(e)=>{
    if(e.target.files.length === 1){
      let data = {...state.data};
      let file = e.target.files[0];
      if(file.type === 'application/x-zip-compressed'){
        data[field.id] = { error: false, file };
        onChange(data);
      }else{
        data[field.id] = { error: true, file: null };
        onChange(data);
      }
    }
  }

  let onChangeWithFiles=(e)=>{
    if(e.target.files.length > 0){
      let data = {...state.data};
      let files = [...e.target.files];
      data[field.id] = files;
      onChange(data);
    }
  }

  switch (field.type.value) {
    case 'text area':{
      return (
        <FormGroup key={field.id}>
          <Label for={`textarea-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input type="textarea" name={`textarea-${field.id}`} id="exampleText" value={state.data[field.id]} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'input':{
      return (
        <FormGroup key={field.id}>
          <Label for={`input-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input name="text" id={`input-${field.id}`} value={state.data[field.id]} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'title':{
      return (
        <FormGroup key={field.id}>
          <Label for={`title-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input name="text" id={`title-${field.id}`} value={state.data[field.id]} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'codeReview':{
      return (
        <FormGroup key={field.id}>
          <Label for={`codeReview-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input name="codeReview" type="file" accept=".zip" id={`codeReview-${field.id}`} onChange={onChangeWithFile} />
          <ErrorMessage show={state.data[field.id].error} message="File is not zip file!" />
        </FormGroup>
      )
    }
    case 'file':{
      return (
        <FormGroup key={field.id}>
          <Label for={`file-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input name="file" type="file" id={`file-${field.id}`} multiple onChange={onChangeWithFiles} />
        </FormGroup>
      )
    }
    case 'Link (URL)':{
      return (
        <FormGroup key={field.id}>
          <Label for={`Link (URL)-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
          <Input name="text" id={`Link (URL)-${field.id}`} value={state.data[field.id]} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'Rich text':{
      return (
        <FormGroup key={field.id}>
          <Label for={`Rich text-${field.id}`}>{field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.description }} /></FormText>
            <CKEditor
              onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) }
              id={`Rich text-${field.id}`}
              data={state.data[field.id]}
              onChange={(e)=>onChangeWithoutTaget(e.editor.getData())}
              config={{
                  height: [ '10em' ],
                  codeSnippet_languages: {
                    javascript: 'JavaScript',
                    php: 'PHP'
                  }
              }}
            />
        </FormGroup>
      )
    }

      break;
    default:{
      return <div key={field.id}>{field.type.value}</div>
    }

  }
}

export const generateView = (fieldValue ) => {
  switch (fieldValue.field.value) {
    case 'text area':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
          <div dangerouslySetInnerHTML={{__html: fieldValue.value.replace(/(?:\r\n|\r|\n)/g, '<br>') }} />
        </FormGroup>
      )
    }
    case 'input':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
          <div>{fieldValue.value}</div>
        </FormGroup>
      )
    }
    case 'title':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
          <div>{fieldValue.value}</div>
        </FormGroup>
      )
    }
    case 'codeReview':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
          <div>
            {
              fieldValue.value === null ?
              <ErrorMessage show={true} message="Súbory na hodnotenie kódu neboli odovzdané!" /> :
              <a href={fieldValue.value.url} target="_blank">
                <Label>{fieldValue.value.name}</Label>
              </a>
            }
          </div>
        </FormGroup>
      )
    }
    case 'file':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
            <div>
              {
                fieldValue.value === null ?
                "Žiadne súbory neboli odovzdané" :
                <a href={fieldValue.value.url} target="_blank">
                  <Label>{fieldValue.value.name}</Label>
                </a>
              }
            </div>
        </FormGroup>
      )
    }
    case 'Link (URL)':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
            <a href={fieldValue.value} target="_blank">
              <Label>{fieldValue.value}</Label>
            </a>
        </FormGroup>
      )
    }
    case 'Rich text':{
      return (
        <FormGroup key={fieldValue.field.id}>
          <Label className="mb-0">{fieldValue.field.title}</Label>
          <div dangerouslySetInnerHTML={{__html: fieldValue.value }} />
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: fieldValue.field.description }} /></FormText>
        </FormGroup>
      )
    }

      break;
    default:{
      return <div key={fieldValue.field.id}>{fieldValue.field.type.value}</div>
    }

  }
}

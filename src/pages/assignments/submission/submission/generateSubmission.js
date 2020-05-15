import React from 'react';
import { FormGroup, Label, Input, FormText } from 'reactstrap';
import CKEditor from 'ckeditor4-react';
import ErrorMessage from 'components/error';

export const generateField = (field, onChange) => {
  const onChangeWithTaget=(event)=>{
    onChange({...field, value: event.target.value });
  }

  const onChangeWithoutTaget=(value)=>{
    onChange({...field, value: value });
  }

  const onChangeWithFile=(e)=>{
    if(e.target.files.length === 1){
      let file = e.target.files[0];
      if(file.type === 'application/x-zip-compressed'){
        onChange({...field, value: file, error: false });
      }else{
        onChange({...field, value: null, error:true });
      }
    }
  }

  const onChangeWithFiles=(e)=>{
    if(e.target.files.length > 0){
      onChange({...field, value: [...e.target.files] });
    }
  }

  switch (field.type.fieldType) {
    case 'text area':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`textarea-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input type="textarea" name={`textarea-${field.id}`} id="exampleText" value={field.value} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'input':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`input-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input name="text" id={`input-${field.id}`} value={field.value} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'title':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`title-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input name="text" id={`title-${field.id}`} value={field.value} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'codeReview':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`codeReview-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input name="codeReview" type="file" accept=".zip" id={`codeReview-${field.id}`} onChange={onChangeWithFile} />
          <ErrorMessage show={field.value.error} message="File is not zip file!" />
        </FormGroup>
      )
    }
    case 'file':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`file-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input name="file" type="file" id={`file-${field.id}`} multiple onChange={onChangeWithFiles} />
        </FormGroup>
      )
    }
    case 'Link (URL)':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`Link (URL)-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <Input name="text" id={`Link (URL)-${field.id}`} value={field.value} onChange={onChangeWithTaget} />
        </FormGroup>
      )
    }
    case 'Rich text':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`Rich text-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <CKEditor
            onBeforeLoad={ ( CKEDITOR ) => ( CKEDITOR.disableAutoInline = true ) }
            id={`Rich text-${field.id}`}
            data={field.value}
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
      return <div key={field.type['@id']}>{field.type.fieldType}</div>
    }
  }
}

export const generateView = ( field ) => {
  switch (field.type.fieldType) {
    case 'text area':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div dangerouslySetInnerHTML={{__html: field.value.replace(/(?:\r\n|\r|\n)/g, '<br>') }} />
          { field.value.length === 0 && <FormText color="muted" className="muted-medium">Empty</FormText> }
        </FormGroup>
      )
    }
    case 'input':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div>{field.value}</div>
          { field.value.length === 0 && <FormText color="muted" className="muted-medium">Empty</FormText> }
        </FormGroup>
      )
    }
    case 'title':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div>{field.value}</div>
          { field.value.length === 0 && <FormText color="muted" className="muted-medium">Empty</FormText> }
        </FormGroup>
      )
    }
    case 'codeReview':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div>
            <ErrorMessage show={field.value === null} message="Súbory na hodnotenie kódu neboli odovzdané!" />
            { field.value !== null &&
              <a href={field.value.url} target="_blank"><Label>{field.value.name}</Label></a>
            }
          </div>
        </FormGroup>
      )
    }
    case 'file':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div>
            {
              field.value === null ?
              "Žiadne súbory neboli odovzdané" :
              <a href={field.value.url} target="_blank">
                <Label>{field.value.name}</Label>
              </a>
            }
          </div>
        </FormGroup>
      )
    }
    case 'Link (URL)':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          { field.value.length > 0 &&
            <a href={field.value} target="_blank">
              <Label>{field.value}</Label>
            </a>
          }
          { field.value.length === 0 && <FormText color="muted" className="muted-medium">Empty</FormText> }
        </FormGroup>
      )
    }
    case 'Rich text':{
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted"><div dangerouslySetInnerHTML={{__html: field.type.description }} /></FormText>
          <div dangerouslySetInnerHTML={{__html: field.value }} />
          { field.value.length === 0 && <FormText color="muted" className="muted-medium">Empty</FormText> }
        </FormGroup>
      )
    }

    break;
    default:{
      return <div key={field.type['@id']}>{field.type.fieldType}</div>
    }

  }
}

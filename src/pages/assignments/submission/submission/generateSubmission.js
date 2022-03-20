import React, { useState, useEffect } from 'react'
import { FormGroup, Label, Input, FormText } from 'reactstrap'
import CKEditor from 'ckeditor4-react'
import ErrorMessage from 'components/error'
import JSZip, { file } from 'jszip'

export const generateField = (field, onChange) => {
  console.log('field_HERE:', field)
  // console.log(onChange)
  const onChangeWithTaget = event => {
    onChange({ ...field, value: event.target.value })
  }

  const onChangeWithoutTaget = value => {
    onChange({ ...field, value: value })
  }

  const onChangeWithFile = async e => {
    console.log(e.target.files)
    if (e.target.files.length === 1) {
      let file = e.target.files[0]
      if (
        file.type === 'application/x-zip-compressed' ||
        file.type === 'application/zip'
      ) {
        console.log('file', file.size) // keby treba obmedzovat velkost.
        const base64 = await convertToBase64(file)

        onChange({ ...field, value: base64, error: false })
      } else {
        onChange({ ...field, value: null, error: true })
      }
    }
  }

  const convertToBase64 = file => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = e => {
        resolve(e.target.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const onChangeWithFiles = e => {
    if (e.target.files.length > 0) {
      onChange({ ...field, value: [...e.target.files] })
    }
  }

  switch (field.type.fieldType) {
    case 'text area': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`textarea-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            type="textarea"
            name={`textarea-${field.id}`}
            id="exampleText"
            value={field.value}
            onChange={onChangeWithTaget}
          />
        </FormGroup>
      )
    }
    case 'input': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`input-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            name="text"
            id={`input-${field.id}`}
            value={field.value}
            onChange={onChangeWithTaget}
          />
        </FormGroup>
      )
    }
    case 'title': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`title-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            name="text"
            id={`title-${field.id}`}
            value={field.value}
            onChange={onChangeWithTaget}
          />
        </FormGroup>
      )
    }
    case 'codeReview': {
      console.log(field)
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`codeReview-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            name="codeReview"
            type="file"
            accept=".zip"
            id={`codeReview-${field.id}`}
            onChange={onChangeWithFile}
          />
          {/* <ErrorMessage show={field.value.error} message="File is not zip file!" /> */}
        </FormGroup>
      )
    }
    case 'file': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`file-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            name="file"
            type="file"
            id={`file-${field.id}`}
            multiple
            onChange={onChangeWithFiles}
          />
        </FormGroup>
      )
    }
    case 'Link (URL)': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`Link (URL)-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <Input
            name="text"
            id={`Link (URL)-${field.id}`}
            value={field.value}
            onChange={onChangeWithTaget}
          />
        </FormGroup>
      )
    }
    case 'Rich text':
      return (
        <FormGroup key={field.type['@id']}>
          <Label for={`Rich text-${field.id}`}>{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <CKEditor
            onBeforeLoad={CKEDITOR => (CKEDITOR.disableAutoInline = true)}
            id={`Rich text-${field.id}`}
            data={field.value}
            onChange={e => onChangeWithoutTaget(e.editor.getData())}
            config={{
              height: ['10em'],
              codeSnippet_languages: {
                javascript: 'JavaScript',
                php: 'PHP',
              },
            }}
          />
        </FormGroup>
      )
    default: {
      return <div key={field.type['@id']}>{field.type.fieldType}</div>
    }
  }
}

// import React from 'react'

// const generateSubmission = () => {
//   return (
//     <div>

//     </div>
//   )
// }

// export default generateSubmission

export const GenerateView = ({ field, value }) => {
  // const [code, setCode] = useState('')
  // useEffect(() => {
  //   convertFromBase64(field.value)
  //   console.log('VALUE:', field.value)
  // }, [])

  const convertFromBase64 = base64File => {
    const i = base64File.indexOf('base64,')
    const buffer = Buffer.from(base64File.slice(i + 7), 'base64')
    console.log(buffer)
    const blob = new Blob([buffer], { type: 'application/zip' })
    console.log('BLOB: ', blob)

    console.log('SET_TEST_FILE')
    var zip = new JSZip()
    zip
      .loadAsync(blob)
      .then(files => {
        console.log('FILES AGAIN', files)
        // dispatch({ type: SET_ASIGNMENTS_TEST_FILE, file: files })
      })
      .catch(error => {
        console.log(error)
      })

    // blob.text().then(text => {
    //   setCode(text.split('\n'))
    // })
  }

  switch (field.type.fieldType) {
    case 'text area': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <div
            dangerouslySetInnerHTML={{
              __html: field.value.replace(/(?:\r\n|\r|\n)/g, '<br>'),
            }}
          />
          {field.value.length === 0 && (
            <FormText color="muted" className="muted-medium">
              Empty
            </FormText>
          )}
        </FormGroup>
      )
    }
    case 'input': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <div>{field.value}</div>
          {field.value.length === 0 && (
            <FormText color="muted" className="muted-medium">
              Empty Submission
            </FormText>
          )}
        </FormGroup>
      )
    }
    case 'title': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <div>{field.value}</div>
          {field.value.length === 0 && (
            <FormText color="muted" className="muted-medium">
              Empty
            </FormText>
          )}
        </FormGroup>
      )
    }
    case 'codeReview': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <div>
            <ErrorMessage
              show={field.value === null}
              message="Súbory na hodnotenie kódu neboli odovzdané!"
            />
            {field.value !== null && (
              <a href={field.value}>
                <Label>Download</Label>
              </a>
            )}
          </div>
        </FormGroup>
      )
    }
    case 'file': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          <div>
            {field.value === null ? (
              'Žiadne súbory neboli odovzdané'
            ) : (
              <a
                href={field.value.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Label>{field.value.name}</Label>
              </a>
            )}
          </div>
        </FormGroup>
      )
    }
    case 'Link (URL)': {
      return (
        <FormGroup key={field.type['@id']}>
          <Label className="mb-0">{field.type.name}</Label>
          <FormText color="muted">
            <div dangerouslySetInnerHTML={{ __html: field.type.description }} />
          </FormText>
          {field.value.length > 0 && (
            <a href={field.value} rel="noopener noreferrer" target="_blank">
              <Label>{field.value}</Label>
            </a>
          )}
          {field.value.length === 0 && (
            <FormText color="muted" className="muted-medium">
              Empty
            </FormText>
          )}
        </FormGroup>
      )
    }
    case 'Rich text':
      {
        return (
          <FormGroup key={field.type['@id']}>
            <Label className="mb-0">{field.type.name}</Label>
            <FormText color="muted">
              <div
                dangerouslySetInnerHTML={{ __html: field.type.description }}
              />
            </FormText>
            <div dangerouslySetInnerHTML={{ __html: field.value }} />
            {field.value.length === 0 && (
              <FormText color="muted" className="muted-medium">
                Empty
              </FormText>
            )}
          </FormGroup>
        )
      }

      break
    default: {
      return <div key={field.type['@id']}>{field.type.fieldType}</div>
    }
  }
}

const Code = ({ code }) => {
  console.log('teraz ide kod')
  console.log('kod:', code)
  if (!code.length) {
    return <div>nacitavam/prazdny</div>
  }
  return (
    <section className="code-review-box">
      {code.map((line, index) => (
        <CodeLine line={line} key={index} />
      ))}
    </section>
  )
}

const CodeLine = ({ line }) => {
  console.log('line', line)
  console.log(line == '')

  if (line == '') {
    return <br />
  }
  return <div className="code-review-line">{line}</div>
}

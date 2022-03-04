import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import * as CKSUPEREDITOR from 'courses-wysiwyg-superbuild'

function CustomEditor({ content, setContent, mimeType }) {
  //FIXME saving in source mode doesn't save it
  //TODO clean code
  return (
    <>
      {mimeType === 'text/html' && (
        <CKEditor
          onReady={editor => {
            // console.log( 'Editor is ready to use!', editor );
            window.editor1 = editor
            // set
            editor.editing.view.change(writer => {
              writer.setStyle(
                'min-height',
                '350px',
                editor.editing.view.document.getRoot()
              )
            })
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            setContent(data)
          }}
          // onBlur={ ( event, editor ) => {
          // } }
          // onFocus={ ( event, editor ) => {
          // } }
          editor={CKSUPEREDITOR.HTMLClassicEditor}
          data={content}
        />
      )}
      {mimeType === 'text/markdown' && (
        <CKEditor
          onReady={editor => {
            // console.log( 'Editor is ready to use!', editor );
            window.editor2 = editor
            // set
            editor.editing.view.change(writer => {
              writer.setStyle(
                'min-height',
                '350px',
                editor.editing.view.document.getRoot()
              )
            })
          }}
          onChange={(event, editor) => {
            const data = editor.getData()
            setContent(data)
          }}
          // onBlur={ ( event, editor ) => {
          // } }
          // onFocus={ ( event, editor ) => {
          // } }
          editor={CKSUPEREDITOR.MarkdownClassicEditor}
          data={content}
        />
      )}
    </>
  )
}

export default CustomEditor

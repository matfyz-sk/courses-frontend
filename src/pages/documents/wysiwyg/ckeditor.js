import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import * as CKSUPEREDITOR from 'courses-wysiwyg-superbuild'

function CustomEditor({ content, setContent, mimeType, isReadOnly }) {
  // TODO clean code
  // TODO upgrade superbuild dep.
  return (
    <>
      {/* <CKEditor
        onReady={editor => {
          if (mimeType === 'text/html') {
            window.editor1 = editor
          } else {
            window.editor2 = editor
          }
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
        editor={mimeType === 'text/html' ? CKSUPEREDITOR.HTMLClassicEditor : CKSUPEREDITOR.MarkdownClassicEditor}
        data={content}
      /> */}
      {mimeType === 'text/html' && (
        <CKEditor
          config={{
            htmlSupport: {
              allow: [
                {
                  // TODO maybe don't allow everything HAHa
                  name: /.*/,
                  attributes: true,
                  classes: true,
                  styles: true,
                },
              ],
              disallow: [
                /* HTML features to disallow */
              ],
            },
            mediaEmbed: {
              previewsInData: true,
            },
          }}
          onReady={editor => {
            window.editor1 = editor

            editor.editing.view.change(writer => {
              writer.setStyle(
                'min-height',
                '350px',
                editor.editing.view.document.getRoot()
              )
            })

            const toolbarElement = editor.ui.view.toolbar.element

            if (isReadOnly) {
              editor.isReadOnly = true
              toolbarElement.style.display = 'none'
            } else {
              editor.isReadOnly = false
              toolbarElement.style.display = 'flex'
            }
          }}
          onChange={(event, editor) => {
            if (!isReadOnly) {
              const data = editor.getData()
              setContent(data)
            }
          }}
          editor={CKSUPEREDITOR.HTMLClassicEditor}
          data={content}
        />
      )}
      {mimeType === 'text/markdown' && (
        <CKEditor
          config={{
            htmlSupport: {
              allow: [
                {
                  // TODO maybe don't allow everything HAHa
                  name: /.*/,
                  attributes: true,
                  classes: true,
                  styles: true,
                },
              ],
              disallow: [
                /* HTML features to disallow */
              ],
            },
          }}
          onReady={editor => {
            window.editor2 = editor

            editor.editing.view.change(writer => {
              writer.setStyle(
                'min-height',
                '350px',
                editor.editing.view.document.getRoot()
              )
            })
            const toolbarElement = editor.ui.view.toolbar.element

            if (isReadOnly) {
              editor.isReadOnly = true
              toolbarElement.style.display = 'none'
            } else {
              editor.isReadOnly = false
              toolbarElement.style.display = 'flex'
            }
          }}
          onChange={(event, editor) => {
            if (!isReadOnly) {
              const data = editor.getData()
              setContent(data)
            }
          }}
          editor={CKSUPEREDITOR.MarkdownClassicEditor}
          data={content}
        />
      )}
    </>
  )
}

export default CustomEditor

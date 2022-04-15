import React, { useEffect } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { marked } from 'marked'

function InternalDocumentRenderer({ setNumPages, payloadContent, mimeType }) {

  useEffect(() => {
    // TODO split document and get num of pages
    setNumPages(1)
    // setPageNumber(1)
  }, [payloadContent])

  const preparePayloadContent = () => {
    if (mimeType === 'text/markdown') {
      return marked.parse(payloadContent, {
        gfm: true,
        breaks: true,
        tables: true,
        xhtml: true,
        headerIds: false,
      })
    }
    return payloadContent
  }

  if (!payloadContent) {
    console.log("yikes")
    return null
  }

  return (
    <>
      <div className="ck ck-editor__main" role="presentation">
        <div
          className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-read-only"
          dir="ltr"
          role="textbox"
          aria-label="Rich Text Editor, main"
          lang="en"
          contentEditable={false}
        >
          {ReactHtmlParser(preparePayloadContent())}
        </div>
      </div>
    </>
  )
}

export default InternalDocumentRenderer

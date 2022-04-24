import React, { useEffect, useState } from 'react'
import { marked } from 'marked'

const markedOptions = {
  gfm: true,
  breaks: true,
  tables: true,
  xhtml: true,
  headerIds: false,
}

function InternalDocumentRenderer({setNumPages, pageNumber, payloadContent, mimeType}) {
  const [pages, setPages] = useState([])

  useEffect(() => {
    let newPages
    if (mimeType === 'text/html') {
      newPages = payloadContent.split('<hr>')
    } else {
      newPages = payloadContent.split('\n---')
    }
    setPages(newPages)
    setNumPages(newPages.length)
  }, [payloadContent])

  const preparePayloadContent = () => {
    if (pages.length === 0) return null
    if (mimeType === 'text/markdown') {
      return marked.parse(pages[pageNumber - 1], markedOptions)
    }
    return pages[pageNumber - 1]
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
          dangerouslySetInnerHTML={{__html: preparePayloadContent()}}
        />
      </div>
    </>
  )
}

export default InternalDocumentRenderer

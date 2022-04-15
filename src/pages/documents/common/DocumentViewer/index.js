import React, { useState, useEffect, useRef } from 'react'
import {
  axiosGetEntities,
  getResponseBody,
  getShortID,
  getShortType,
} from 'helperFunctions'
import { DocumentEnums } from 'pages/documents/enums/document-enums'
import PdfRenderer from './PdfRenderer'
import InternalDocumentRenderer from './InternalDocumentRenderer'
import './styles/DocumentViewer.css'
import { IconButton, TextField, ThemeProvider } from '@material-ui/core'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md'
import { HiDownload } from 'react-icons/hi'
import { MdFullscreenExit } from 'react-icons/md'
import { usePdfRendererStyles, customTheme } from '../../styles/styles'
import downloadBase64File from 'pages/documents/functions/downloadBase64File'
import useEventListener from '@use-it/event-listener'

function DocumentViewer({ document, onViewingDocumentChange }) {
  const classes = usePdfRendererStyles()
  // eventl listener doesnt work when i change page with buttons so this is a fix...
  const focusHackRef = useRef()

  const [documentId, setDocumentId] = useState(
    getShortID(document.payload[0]['@id'])
  )
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [payloadContent, setPayloadContent] = useState('')
  const entityName = getShortType(document['@type'])
  const getPayloadContent = () => document.payload[0].content

  useEffect(() => {
    const payloadUrl = `payload/${documentId}`
    axiosGetEntities(payloadUrl)
      .then(response => {
        if (response.failed) {
          console.error("Couldn't fetch document content")
          return
        }
        return getResponseBody(response)[0]
      })
      .then(payload => {
        setPayloadContent(payload.content)
      })
  }, [documentId])

  const changePage = offset => {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }

  const previousPage = () => {
    if (pageNumber > 1) {
      changePage(-1)
      focusHackRef.current.focus()
    }
  }

  const nextPage = () => {
    if (pageNumber < numPages) {
      changePage(1)
      focusHackRef.current.focus()
    }
  }

  const onInputValueChange = e => {
    const value = Number(e.target.value)
    if (isNaN(value)) return

    if (value < 1) {
      setPageNumber(1)
    } else if (value > numPages) {
      setPageNumber(numPages)
    } else {
      setPageNumber(value)
    }
  }

  function onKeyDown({ key }) {
    if (key === 'ArrowLeft' && pageNumber > 1) {
      previousPage()
    } else if (key === 'ArrowRight' && pageNumber < numPages) {
      nextPage()
    }
  }

  useEventListener('keydown', onKeyDown)

  return (
    <ThemeProvider theme={customTheme}>
      <div className="document-viewer">
        <header tabIndex={-1} ref={focusHackRef}>
          <IconButton
            aria-label="previous page"
            disabled={pageNumber <= 1}
            onClick={previousPage}
            style={{ fontSize: '150%', outline: 'none' }}
          >
            <MdKeyboardArrowDown />
          </IconButton>
          <IconButton
            aria-label="next page"
            disabled={pageNumber >= numPages}
            onClick={nextPage}
            style={{ fontSize: '150%', outline: 'none' }}
          >
            <MdKeyboardArrowUp />
          </IconButton>
          <TextField
            id="page-number"
            type="number"
            value={pageNumber}
            onChange={onInputValueChange}
            className={classes.input}
            variant="outlined"
            size="small"
            onFocus={event => {
              event.target.select()
            }}
          />
          of {numPages}
          {/* <div style={{margin: "auto"}}>
            <strong>{document.name}</strong>
          </div> */}
          <IconButton
            onClick={e => onViewingDocumentChange(null)}
            style={{
              fontSize: '150%',
              outline: 'none',
              marginLeft: 'auto',
            }}
          >
            <MdFullscreenExit />
          </IconButton>
          <IconButton
            aria-label="download pdf"
            onClick={e =>
              downloadBase64File(
                {
                  payload: [{ content: getPayloadContent() }], // TODO md and html?
                  filename: document.filename,
                  mimeType: document.mimeType,
                },
                window
              )
            }
            style={{
              fontSize: '150%',
              outline: 'none',
            }}
          >
            {' '}
            <HiDownload />
          </IconButton>
        </header>
        <div className="document-viewer__container">
          <div
            onClick={previousPage}
            className={`page-control left ${pageNumber > 1 ? 'enabled' : ''}`}
          >
            <IconButton
              aria-label="previous page"
              disabled={pageNumber <= 1}
              style={{
                height: '100%',
                fontSize: '150%',
                outline: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <MdKeyboardArrowLeft />
            </IconButton>
          </div>
          <div className="document-viewer__container__document">
            <>
              {entityName === DocumentEnums.file.entityName &&
                document.mimeType === 'application/pdf' && (
                  <PdfRenderer
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    numPages={numPages}
                    setNumPages={setNumPages}
                    pdf={getPayloadContent()}
                  />
                )}
              {entityName === DocumentEnums.internalDocument.entityName && (
                <InternalDocumentRenderer
                  style={{ boxSizing: 'border-box', width: '100%' }}
                  pageNumber={pageNumber}
                  setNumPages={setNumPages}
                  payloadContent={payloadContent}
                  mimeType={document.mimeType}
                />
              )}
            </>
          </div>
          <div
            onClick={nextPage}
            className={`page-control right ${
              pageNumber < numPages ? 'enabled' : ''
            }`}
          >
            <IconButton
              aria-label="next page"
              disabled={pageNumber >= numPages}
              style={{
                height: '100%',
                fontSize: '150%',
                outline: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <MdKeyboardArrowRight />
            </IconButton>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default DocumentViewer

import React, { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import throttle from 'lodash.throttle'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

function PdfRenderer({pageNumber, setNumPages, setPageNumber, pdf, width}) {
  const [PDFwidth, setPDFWidth] = useState(null)
  const myInput = useRef()
  const throttledSetPDFWidth = throttle(doSetPDFWidth, 250)

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages)
  }

  useEffect(() => {
    // setting width at initial
    doSetPDFWidth()

    // event listener when window is resized
    window.addEventListener('resize', throttledSetPDFWidth)
    return () => {
      window.removeEventListener('resize', throttledSetPDFWidth)
    }
  }, [])

  function doSetPDFWidth() {
    const width = myInput.current.offsetWidth
    setPDFWidth(width)
  }

  const onItemClick = ({pageNumber: itemPageNumber}) => {
    setPageNumber(itemPageNumber)
  }

  // fix for misalinged text layer
  const removeTextLayerOffset = () => {
    const textLayers = document.querySelectorAll(
      '.react-pdf__Page__textContent'
    )
    textLayers.forEach(layer => {
      const {style} = layer
      style.top = '0'
      style.left = '0'
      style.transform = ''
    })
  }

  return (
    <Document
      inputRef={myInput}
      file={pdf}
      onLoadSuccess={onDocumentLoadSuccess}
      renderMode="svg"
      onItemClick={onItemClick}
    >
      <Page
        onLoadSuccess={removeTextLayerOffset}
        pageNumber={pageNumber}
        width={PDFwidth}
      />
    </Document>
  )
}

export default PdfRenderer

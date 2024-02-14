import React, { useRef, useState } from "react"
import { getShortType } from "../../../helperFunctions"
import { DocumentEnums } from "../common/enums/document-enums"
import PdfRenderer from "./PdfRenderer"
import InternalDocumentRenderer from "./InternalDocumentRenderer"
import "./DocumentViewer.css"
import { IconButton, TextField, ThemeProvider, useMediaQuery } from "@material-ui/core"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import {
    MdFullscreenExit,
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardArrowUp,
} from "react-icons/md"
import { HiDownload } from "react-icons/hi"
import { customTheme, usePdfRendererStyles } from "../styles"
import downloadBase64File from "../common/functions/downloadBase64File"
import useEventListener from "@use-it/event-listener"
import { useGetContentOfDocumentQuery } from "../../../services/documentsGraph"

function DocumentViewer({ document, onViewingDocumentChange }) {
    const classes = usePdfRendererStyles()
    const isMobile = useMediaQuery("(max-width: 767px)")
    // event listener doesn't work when I change page with buttons so this is a fix...
    const focusHackRef = useRef()

    const { data: documentContent } = useGetContentOfDocumentQuery({ id: document._id })

    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const entityName = getShortType(document._type)

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
        if (key === "ArrowLeft" && pageNumber > 1) {
            previousPage()
        } else if (key === "ArrowRight" && pageNumber < numPages) {
            nextPage()
        }
    }

    useEventListener("keydown", onKeyDown)

    if (!documentContent) return null

    return (
        <ThemeProvider theme={customTheme}>
            <div className="document-viewer">
                <header tabIndex={-1} ref={focusHackRef}>
                    <IconButton
                        aria-label="previous page"
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                        style={{ fontSize: "125%", outline: "none" }}
                    >
                        <MdKeyboardArrowUp />
                    </IconButton>
                    <IconButton
                        aria-label="next page"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                        style={{ fontSize: "125%", outline: "none" }}
                    >
                        <MdKeyboardArrowDown />
                    </IconButton>
                    <TextField
                        id="page-number"
                        type="number"
                        value={pageNumber}
                        onChange={onInputValueChange}
                        className={classes.input}
                        variant="outlined"
                        size="small"
                        style={{ marginLeft: isMobile && "auto" }}
                        onFocus={event => {
                            event.target.select()
                        }}
                    />
                    <span style={{ marginRight: isMobile && "auto" }}>of {numPages}</span>

                    <div style={{ margin: "auto" }}>
                        <strong>{document.name}</strong>
                    </div>
                    <IconButton
                        onClick={() => onViewingDocumentChange(null)}
                        style={{
                            fontSize: "150%",
                            outline: "none",
                            marginLeft: "auto",
                        }}
                    >
                        <MdFullscreenExit />
                    </IconButton>
                    {entityName === DocumentEnums.file.entityName && (
                        <IconButton
                            aria-label="download pdf"
                            onClick={() =>
                                downloadBase64File(documentContent, document.filename, document.mimeType, window)
                            }
                            style={{
                                fontSize: "150%",
                                outline: "none",
                            }}
                        >
                            {" "}
                            <HiDownload />
                        </IconButton>
                    )}
                </header>
                <div className="document-viewer__container">
                    <div onClick={previousPage} className={`page-control left ${pageNumber > 1 ? "enabled" : ""}`}>
                        <IconButton
                            aria-label="previous page"
                            disabled={pageNumber <= 1}
                            style={{
                                height: "100%",
                                fontSize: "150%",
                                outline: "none",
                                backgroundColor: "transparent",
                            }}
                        >
                            <MdKeyboardArrowLeft />
                        </IconButton>
                    </div>
                    <div className="document-viewer__container__document">
                        <>
                            {entityName === DocumentEnums.file.entityName &&
                                document.mimeType === "application/pdf" && (
                                    <PdfRenderer
                                        pageNumber={pageNumber}
                                        setPageNumber={setPageNumber}
                                        numPages={numPages}
                                        setNumPages={setNumPages}
                                        pdf={documentContent}
                                    />
                                )}
                            {entityName === DocumentEnums.internalDocument.entityName && (
                                <InternalDocumentRenderer
                                    style={{ boxSizing: "border-box", width: "100%" }}
                                    pageNumber={pageNumber}
                                    setNumPages={setNumPages}
                                    payloadContent={documentContent}
                                    mimeType={document.mimeType}
                                />
                            )}
                        </>
                    </div>
                    <div onClick={nextPage} className={`page-control right ${pageNumber < numPages ? "enabled" : ""}`}>
                        <IconButton
                            aria-label="next page"
                            disabled={pageNumber >= numPages}
                            style={{
                                height: "100%",
                                fontSize: "150%",
                                outline: "none",
                                backgroundColor: "transparent",
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

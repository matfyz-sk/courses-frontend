import React from "react"
import TextComparator from "./TextComparator"
import { DocumentEnums } from "../common/enums/document-enums"
import { MdChevronRight } from "react-icons/md"
import { Link } from "react-router-dom"
import { HiDownload } from "react-icons/hi"
import { customTheme } from "../styles"
import { marked } from "marked"
import diff from "node-htmldiff"
import downloadBase64File from "../common/functions/downloadBase64File"

const markedOptions = {
    gfm: true,
    breaks: true,
    tables: true,
    xhtml: true,
    headerIds: false,
}

export default function EntityComparator({ entityName, pickedVersionA, pickedVersionB }) {
    const diffEditorContents = () => {
        let before = pickedVersionB.editorContent ? pickedVersionB.editorContent : ""
        let after = pickedVersionA.editorContent ? pickedVersionA.editorContent : ""
        if (pickedVersionA.mimeType === "text/markdown") {
            before = marked.parse(before, markedOptions)
            after = marked.parse(after, markedOptions)
        }
        before = before.replaceAll("<hr>", "<hr>a</hr>")
        after = after.replaceAll("<hr>", "<hr>a</hr>")

        const documentsDiff = diff(before, after, "revisions-diff")
        let cleanedDiff = documentsDiff.replaceAll("<hr>a</hr>", "<hr>")
        cleanedDiff = cleanedDiff.replaceAll(
            /<hr data-diff-node="ins" data-operation-index="\d+"><ins data-operation-index="\d+" class="revisions-diff">a<\/ins><\/hr>/g,
            '<hr data-diff-node="ins" class="revisions-diff">'
        )
        cleanedDiff = cleanedDiff.replaceAll(
            /<hr data-diff-node="del" data-operation-index="\d+"><del data-operation-index="\d+" class="revisions-diff">a<\/del><\/hr>/g,
            '<hr data-diff-node="del" class="revisions-diff">'
        )
        return cleanedDiff
    }

    const onDownloadFile = (e, v) => {
        e.preventDefault()
        downloadBase64File(v.rawContent, v.filename, v.mimeType, window)
    }

    return (
        <>
            {entityName === DocumentEnums.externalDocument.entityName && (
                <>
                    <h5>Url:</h5>
                    {pickedVersionB.uri.length !== 0 && pickedVersionB.uri !== pickedVersionA.uri && (
                        <>
                            <a href={pickedVersionB.uri}>{pickedVersionB.uri}</a>
                            <MdChevronRight
                                size={28}
                                style={{
                                    color: "grey",
                                    margin: "0 1em 0 1em",
                                }}
                            />
                        </>
                    )}
                    <a href={pickedVersionA.uri}>{pickedVersionA.uri}</a>
                </>
            )}
            {entityName === DocumentEnums.file.entityName && (
                <>
                    <h5>Filename:</h5>
                    <TextComparator textA={pickedVersionA.filename} textB={pickedVersionB.filename} />

                    <h5>File mime:</h5>
                    <TextComparator textA={pickedVersionA.mimeType} textB={pickedVersionB.mimeType} />

                    <h5>File:</h5>
                    <>
                        {pickedVersionB.rawContent && pickedVersionB.rawContent !== pickedVersionA.rawContent && (
                            <>
                                <Link
                                    id="file-download"
                                    to={{ textDecoration: "none" }}
                                    onClick={e => onDownloadFile(e, pickedVersionB)}
                                >
                                    {pickedVersionB.mimeType.startsWith("image") ? (
                                        <img
                                            style={{ display: "inline", maxWidth: "120px" }}
                                            src={pickedVersionB.rawContent}
                                            alt="image of the older document version"
                                        />
                                    ) : (
                                        <HiDownload
                                            style={{
                                                color: customTheme.palette.primary.main,
                                            }}
                                            size={42}
                                        />
                                    )}
                                </Link>
                                <MdChevronRight
                                    size={42}
                                    style={{
                                        color: "grey",
                                        margin: "0 2em 0 2em",
                                    }}
                                />
                            </>
                        )}
                        <Link
                            id="file-download"
                            to={{ textDecoration: "none" }}
                            onClick={e => onDownloadFile(e, pickedVersionA)}
                        >
                            {pickedVersionA.mimeType.startsWith("image") ? (
                                <img
                                    style={{ display: "inline", maxWidth: "120px" }}
                                    src={pickedVersionA.rawContent}
                                    alt="image of the newer document version"
                                />
                            ) : (
                                <HiDownload
                                    style={{
                                        color: customTheme.palette.primary.main,
                                    }}
                                    size={42}
                                />
                            )}
                        </Link>
                    </>
                </>
            )}
            {entityName === DocumentEnums.internalDocument.entityName && (
                <>
                    {/*   want to use ckeditor styling but not its data processor */}
                    <div className="ck ck-editor__main" role="presentation">
                        <div
                            className="ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-read-only"
                            dir="ltr"
                            role="textbox"
                            aria-label="Rich Text Editor, main"
                            lang="en"
                            contentEditable={false}
                            dangerouslySetInnerHTML={{ __html: diffEditorContents() }}
                        />
                    </div>
                </>
            )}
        </>
    )
}

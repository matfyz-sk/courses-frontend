import React from "react"
import { useFileExplorerStyles } from "../styles"
import { MdAttachFile, MdCode, MdFolder, MdLink } from "react-icons/md"
import { DocumentEnums, getEntityName } from "./enums/document-enums"
import { useMediaQuery } from "@material-ui/core"
import { BsBook } from "react-icons/all";

const entityToIcon = {
    [DocumentEnums.internalDocument.entityName]: <MdCode />,
    [DocumentEnums.folder.entityName]: <MdFolder />,
    [DocumentEnums.externalDocument.entityName]: <MdLink />,
    [DocumentEnums.file.entityName]: <MdAttachFile />,
}

const FileIcon = ({ file }) => {
    const classes = useFileExplorerStyles()
    const entityName = getEntityName(file._type)
    const isMobile = useMediaQuery("(max-width: 600px)")

    return (
        <div className={classes.infoButton} style={{ fontSize: isMobile && "80%" }}>
            {entityToIcon[entityName]}
            {file.isMaterial && <BsBook style={{ marginLeft: '0.75em' }} />}
        </div>
    )
}

export default FileIcon

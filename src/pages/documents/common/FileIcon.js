import React from "react"
import { useFileExplorerStyles } from "../styles/styles"
import { MdFolder, MdCode, MdLink, MdAttachFile } from "react-icons/md"
import { BsBook } from 'react-icons/bs'
import { DocumentEnums } from "../enums/document-enums"
import { getShortType } from "helperFunctions"

const FileIcon = ({ file }) => {
  const classes = useFileExplorerStyles()
  const entityName = getShortType(file["@type"])


  const entityToIcon = {
    [DocumentEnums.internalDocument.entityName]: (
      <MdCode className={classes.infoButton} />
    ),
    [DocumentEnums.folder.entityName]: <MdFolder className={classes.infoButton} />,
    [DocumentEnums.externalDocument.entityName]: (
      <MdLink className={classes.infoButton} />
    ),
    [DocumentEnums.file.entityName]: <MdAttachFile className={classes.infoButton} />,
  }

  return (
    <>
      {entityToIcon[entityName]}
      <BsBook style={{marginLeft: '0.75em'}} className={classes.infoButton}/>
    </>
  )
}

export default FileIcon
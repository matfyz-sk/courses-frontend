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
      <MdCode className={classes.info} />
    ),
    [DocumentEnums.folder.entityName]: <MdFolder className={classes.info} />,
    [DocumentEnums.externalDocument.entityName]: (
      <MdLink className={classes.info} />
    ),
    [DocumentEnums.file.entityName]: <MdAttachFile className={classes.info} />,
  }

  return (
    <>
      {entityToIcon[entityName]}
      <BsBook style={{marginLeft: '0.75em'}} className={classes.info}/>
    </>
  )
}

export default FileIcon
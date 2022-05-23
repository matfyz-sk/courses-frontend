import React from 'react'
import { useFileExplorerStyles } from '../styles'
import { MdAttachFile, MdCode, MdFolder, MdLink } from 'react-icons/md'
import { BsBook } from 'react-icons/bs'
import { DocumentEnums } from './enums/document-enums'
import { getShortType } from '../../../helperFunctions'
import { useMediaQuery } from '@material-ui/core'

const entityToIcon = {
  [DocumentEnums.internalDocument.entityName]: <MdCode />,
  [DocumentEnums.folder.entityName]: <MdFolder />,
  [DocumentEnums.externalDocument.entityName]: <MdLink />,
  [DocumentEnums.file.entityName]: <MdAttachFile />,
}

const FileIcon = ({ file }) => {
  const classes = useFileExplorerStyles()
  const entityName = getShortType(file['@type'])
  const isMobile = useMediaQuery('(max-width: 600px)')

  return (
    <div className={classes.infoButton} style={{ fontSize: isMobile && '80%' }}>
      {entityToIcon[entityName]}
      {<BsBook style={{ marginLeft: '0.75em' }} />}
    </div>
  )
}

export default FileIcon

import React, { useEffect, useState } from 'react'
import '../../core/Events/Events.css'
import { getIcon } from '../../core/Helper'
import {
  axiosGetEntities,
  getResponseBody,
  getShortID,
  getShortType,
} from '../../../helperFunctions'
import { Link } from 'react-router-dom'
import { DocumentEnums } from '../enums/document-enums'
import downloadBase64File from '../functions/downloadBase64File'
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/node_modules/@material-ui/styles'
import { customTheme } from '../styles/styles'

const useStyles = makeStyles(() => ({
  listItemRoot: {
    '&:hover': { color: customTheme.palette.primary.main },
  },
}))

function EventDocumentList({ onViewableDocumentClick, documentReference }) {
  const classes = useStyles()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    const docsPromises = []
    for (const docRef of documentReference) {
      const entityUrl = `document/${getShortID(docRef.hasDocument)}`
      docsPromises.push(axiosGetEntities(entityUrl))
    }
    Promise.all(docsPromises).then(responses => {
      const documents = responses.map(response => getResponseBody(response)[0])
      setDocuments(documents.filter(doc => !doc.isDeleted))
    })
  }, [documentReference])

  const loadFile = doc => {
    const entityUrl = `payload/${getShortID(doc.payload[0]['@id'])}`
    axiosGetEntities(entityUrl)
      .then(response => getResponseBody(response)[0].content)
      .then(base64data =>
        downloadBase64File(base64data, doc.filename, doc.mimeType, window)
      )
  }

  return (
    <List className="event-documents-list" dense>
      {documents.map((doc, i) => {
        const entityName = getShortType(doc['@type'])
        let navProps
        switch (entityName) {
          case DocumentEnums.externalDocument.entityName:
            navProps = {
              component: 'a',
              href: doc.uri,
              target: '_blank',
              rel: 'noopener noreferrer',
            }
            break
          default:
            if (
              entityName === DocumentEnums.file.entityName &&
              doc.mimeType !== 'application/pdf'
            ) {
              navProps = {
                component: Link,
                to: {},
                onClick: () => loadFile(doc),
              }
              break
            }
            navProps = {
              component: Link,
              to: {},
              onClick: () => onViewableDocumentClick(doc),
            }
            break
        }
        return (
          <div key={i}>
            <ListItem
              button={true}
              className={classes.listItemRoot}
              style={{ paddingLeft: !isMobile && '10%' }}
              {...navProps}
            >
              <ListItemIcon>{getIcon('Material')}</ListItemIcon>
              <ListItemText primary={doc.name} />
            </ListItem>
            {i !== documents.length - 1 && <Divider />}
          </div>
        )
      })}
    </List>
  )
}

export default EventDocumentList

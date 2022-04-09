import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@material-ui/core'
import { MdClear, MdAdd, MdExpandMore } from 'react-icons/md'
import FileIcon from '../FileIcon'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 420,
    minHeight: 54,
  },
  accordionContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  },
}))

export default function DocumentsList({
  documents,
  onRemoveHandler,
  toggleSelection,
  title,
}) {
  const classes = useStyles()

  return (
    <Accordion className={classes.root}>
      <AccordionSummary
        expandIcon={<MdExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="body1">{title} ({documents.length})</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionContent}>
        <List style={{ width: '100%' }}>
          <ListItem
            button
            onClick={e => toggleSelection()}
            style={{
              borderTop: `1px solid #dadada`,
              borderBottom: `1px solid #dadada`,
            }}
          >
            <MdAdd
              style={{ fontSize: '145%', display: 'block', margin: 'auto' }}
            />
          </ListItem>
          {documents.map(document => (
            <ListItem dense button key={document['@id']}>
              <ListItemIcon style={{ marginRight: '1em' }}>
                <FileIcon file={document} />
              </ListItemIcon>
              <ListItemText
                style={{ wordWrap: 'break-word' }}
                primary={document.name}
              />
              <IconButton
                onClick={e => onRemoveHandler(document)}
                edge="end"
                aria-label="remove"
                style={{ outline: 'none', marginRight: '-11px' }}
              >
                {<MdClear style={{ fontSize: '85%' }} />}
              </IconButton>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  )
}

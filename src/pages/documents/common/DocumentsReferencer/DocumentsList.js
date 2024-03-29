import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@material-ui/core"
import { MdAdd, MdClear, MdExpandMore } from "react-icons/md"
import FileIcon from "../FileIcon"

const useStyles = makeStyles(() => ({
    list: {
        width: "100%",
    },
    listAdd: {
        borderTop: `1px solid #dadada`,
        borderBottom: `1px solid #dadada`,
    },
    listAddButton: {
        fontSize: "145%",
        display: "block",
        margin: "auto",
    },
    listItemText: {
        wordWrap: "break-word",
    },
    removeButtonWrap: {
        outline: "none",
        marginRight: "-11px",
    },
    removeButton: {
        fontSize: "85%",
        outline: "none",
    },
    listItemIcon: {
        marginRight: "0.5em",
    },
    accordionContent: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: 0,
    },
}))

export default function DocumentsList({ documents, onRemoveHandler, toggleSelection, title, isReadOnly }) {
    const classes = useStyles()

    if (!documents) {
        return null
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography variant="body1">
                    {title} ({documents.length})
                </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordionContent}>
                <List className={classes.list}>
                    <ListItem
                        button
                        onClick={() => toggleSelection()}
                        className={classes.listAdd}
                        disabled={isReadOnly}
                    >
                        <MdAdd className={classes.listAddButton} />
                    </ListItem>
                    {documents.map(document => (
                        <ListItem dense button key={document._id}>
                            <ListItemIcon className={classes.listItemIcon}>
                                <FileIcon file={document} />
                            </ListItemIcon>
                            <ListItemText className={classes.listItemText} primary={document.name} />
                            <IconButton
                                onClick={() => onRemoveHandler(document)}
                                edge="end"
                                aria-label="remove"
                                className={classes.removeButtonWrap}
                                style={{ outline: "none" }}
                            >
                                {<MdClear className={classes.removeButton} />}
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

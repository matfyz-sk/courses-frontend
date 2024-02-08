import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { Collapse, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core"
import { MdAdd, MdClear, MdDone, MdExpandLess, MdExpandMore } from "react-icons/md"
import TextField from "@material-ui/core/TextField"
import { useTopicStyles } from "../../documents/styles"

function ExpandingListWithSimpleCreate({ items, title, isEdit, handleNewItemSubmit }) {
    // TODO should be able to add from THE existing items... i forgor :(
    const classes = useTopicStyles()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAddingNewItem, setIsAddingNewItem] = useState(false)
    const [newItemValue, setNewItemValue] = useState("")

    const onAddingItemDone = _ => {
        handleNewItemSubmit(newItemValue)
        setIsAddingNewItem(prev => !prev)
        setNewItemValue("")
    }

    if (!isEdit && items.length === 0) {
        return null
    }

    return (
        <List dense style={{ width: "100%" }}>
            <ListItem className={classes.root} button onClick={() => setIsExpanded(prev => !prev)}>
                <ListItemIcon>{isExpanded ? <MdExpandLess /> : <MdExpandMore />}</ListItemIcon>
                <ListItemText disableTypography primary={<Typography variant="h4">{title}</Typography>} />
            </ListItem>
            <Collapse className={classes.nested} in={isExpanded} timeout="auto" unmountOnExit>
                {isEdit &&
                    (isAddingNewItem ? (
                        <ListItem className={classes.listAdd}>
                            <TextField
                                size="small"
                                variant="outlined"
                                value={newItemValue}
                                onChange={_ => setNewItemValue(_.target.value)}
                            />
                            <IconButton onClick={onAddingItemDone}>
                                <MdDone />
                            </IconButton>
                            <IconButton onClick={() => setIsAddingNewItem(prev => !prev)}>
                                <MdClear />
                            </IconButton>
                        </ListItem>
                    ) : (
                        <ListItem button className={classes.listAdd} onClick={() => setIsAddingNewItem(prev => !prev)}>
                            <MdAdd className={classes.listAddButton} />
                        </ListItem>
                    ))}
                {items?.map(item => (
                    <ListItem key={item._id} className={classes.root}>
                        <ListItemText primary={item.name} />
                        {isEdit && (
                            <IconButton edge="end" size="small" aria-label="remove" style={{ outline: "none" }}>
                                {<MdClear className={classes.removeButton} />}
                            </IconButton>
                        )}
                    </ListItem>
                ))}
            </Collapse>
        </List>
    )
}

export default withRouter(ExpandingListWithSimpleCreate);

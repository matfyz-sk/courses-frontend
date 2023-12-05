import { useTopicStyles } from "../../documents/styles"
import React, { useState } from "react"
import { useGetTopicsQuery } from "../../../services/topic"
import { Collapse, ListItem, ListItemIcon, ListItemText } from "@material-ui/core"
import { MdExpandLess, MdExpandMore } from "react-icons/md"
import { withRouter } from "react-router-dom"

function TopicListItem({ topic, selectedTopicId, setSelectedTopicId }) {
    const classes = useTopicStyles()
    const [open, setOpen] = useState(false)
    const { data: allTopics } = useGetTopicsQuery()
    const subtopics = allTopics?.filter(a => a.subtopicOf.map(b => b._id).includes(topic._id)) ?? []

    const selectTopic = _ => {
        setOpen(prev => !prev)
        setSelectedTopicId(topic._id)
    }

    return (
        <>
            <ListItem
                className={selectedTopicId?._id === topic._id ? classes.selectedTopic : classes.root}
                button
                onClick={selectTopic}
            >
                <ListItemIcon
                    style={{
                        visibility: subtopics?.length >= 0 ? "none" : "hidden",
                    }}
                >
                    {open ? <MdExpandLess /> : <MdExpandMore />}
                </ListItemIcon>
                <ListItemText primary={topic.name} />
            </ListItem>
            {subtopics?.length > 0 && (
                <Collapse className={classes.nested} in={open} timeout="auto" unmountOnExit>
                    {subtopics.map(subtopic => (
                        <TopicListItem
                            key={subtopic._id}
                            topic={subtopic}
                            setSelectedTopicId={setSelectedTopicId}
                            selectedTopicId={selectedTopicId}
                        />
                    ))}
                </Collapse>
            )}
        </>
    )
}

export default withRouter(TopicListItem)

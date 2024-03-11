import React from "react"
import { withRouter } from "react-router-dom"
import { MdChevronRight, MdExpandMore } from "react-icons/md"
import TreeItem from "@material-ui/lab/TreeItem"
import { TreeView } from "@material-ui/lab"
import { useGetTopicsQuery } from "../../../services/topic";

function TopicTreeList({ courseInstanceId, setSelectedTopicId }) {
    const { data: allTopics, isLoading } = useGetTopicsQuery()
    const topLevelTopics = allTopics?.filter(topic => topic.subtopicOf.length === 0) ?? []

    const renderTree = topic => {
        if (!topic) {
            return null
        }
        const subtopics = allTopics?.filter(t => t.subtopicOf.map(s => s._id).includes(topic._id)) ?? []
        return (
            <TreeItem key={topic._id} nodeId={topic._id} label={topic.name}>
                {subtopics.map(s => renderTree(s))}
            </TreeItem>
        )
    }

    if (isLoading) {
        return null
    }

    return (
        <TreeView
            onNodeSelect={(event, nodeId) => setSelectedTopicId(nodeId)}
            defaultCollapseIcon={<MdExpandMore />}
            defaultExpandIcon={<MdChevronRight />}
        >
            {topLevelTopics.map(topic => renderTree(topic))}
        </TreeView>
    )
}

export default withRouter(TopicTreeList)

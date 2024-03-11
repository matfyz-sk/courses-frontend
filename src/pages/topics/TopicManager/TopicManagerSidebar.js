import React from "react"
import { Button } from "@material-ui/core"
import TopicTreeList from "./TopicTreeList"

export default function TopicManagerSidebar({ addTopic, courseInstanceId, setSelectedTopicId}) {
    return (
        <>
            <Button fullWidth={true} style={{ marginBottom: "0.5em"}} variant="outlined" onClick={addTopic}>
                Add Topic
            </Button>
            <TopicTreeList
                courseInstanceId={courseInstanceId}
                setSelectedTopicId={setSelectedTopicId}
            />
        </>
    )
}

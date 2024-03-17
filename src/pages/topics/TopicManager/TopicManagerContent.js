import TopicDetail from "./TopicDetail"
import React from "react"

function TopicManagerContent({ selectedTopicId, setSelectedTopicId, isEdit, handleIsEditChange }) {
    return (
        <>
            {selectedTopicId ? (
                <TopicDetail
                    topicId={selectedTopicId}
                    handleTopicIdChange={setSelectedTopicId}
                    isEdit={isEdit}
                    handleIsEditChange={handleIsEditChange}
                />
            ) : (
                <h1>Select a topic to browse</h1>
            )}
        </>
    )
}

export default TopicManagerContent

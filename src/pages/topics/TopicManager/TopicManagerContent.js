import TopicDetail from "./TopicDetail"
import React from "react"
import TopicGraph from "./TopicGraph";

function TopicManagerContent({ selectedTopicId, setSelectedTopicId, isEdit, handleIsEditChange, setShowGraph, showGraph }) {
    return (
        <>
          {showGraph ? (
              <div style={{width: "100%", height: "600px"}}>
                <TopicGraph
                  selectedTopicId={selectedTopicId}
                  setSelectedTopicId={setSelectedTopicId}
                  setShowGraph={setShowGraph}/>
              </div>) :
            (selectedTopicId ? (
                <TopicDetail
                    topicId={selectedTopicId}
                    handleTopicIdChange={setSelectedTopicId}
                    isEdit={isEdit}
                    handleIsEditChange={handleIsEditChange}
                    setShowGraph={setShowGraph}
                />
            ) : (
                <h1>Select a topic to browse</h1>
            ))}
        </>
    )
}

export default TopicManagerContent

import TopicDetail from "./TopicDetail"
import React, {useState} from "react"
import TopicGraphManager from "./TopicGraphManager";
import {MdDeviceHub, MdEdit, MdFormatAlignLeft} from "react-icons/md";
import {Box, IconButton} from "@material-ui/core";
import TopicGraphToggle from "./TopicGraphToggle";

function TopicManagerContent({ selectedTopicId, setSelectedTopicId, isEdit, handleIsEditChange }) {
  const [showGraph, setShowGraph] = useState(false)

    return (
        <>
          <TopicGraphToggle
            showGraph={showGraph}
            setShowGraph={setShowGraph}
          />

          {showGraph ? (
              <div style={{width: "100%", height: "600px"}}>
                <TopicGraphManager
                  selectedElementId={selectedTopicId}
                  setSelectedElementId={setSelectedTopicId}
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

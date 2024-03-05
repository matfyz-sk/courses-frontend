import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import {Button, Divider, IconButton, List, ThemeProvider} from "@material-ui/core"
import { customTheme } from "../../documents/styles"
import { useGetTopicsQuery, useNewTopicMutation } from "../../../services/topic"
import TopicListItem from "./TopicListItem"
import TopicDetail from "./TopicDetail"
import {MdDeviceHub} from "react-icons/md";
import { MdFormatListBulleted } from "react-icons/md";
import TopicsGraph from "./TopicsGraph";

function TopicManager() {
    // TODO make UI show error
    const { data: allTopics } = useGetTopicsQuery()
    const [newTopic] = useNewTopicMutation()
    const [selectedTopicId, setSelectedTopicId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [showGraph, setShowGraph] = useState(false)
    const topLevelTopics = allTopics?.filter(topic => topic.subtopicOf.length === 0) ?? []

    const handleIsEditChange = bool => {
        setIsEdit(bool)
    }

    const handleShowGraphChange = bool => {
      setShowGraph(bool)
    }

    const addTopic = async () => {
        try {
            const result = await newTopic({
                name: "New Topic",
                description: "",
                subtopicOf: [],
                topicPrerequisite: [],
            }).unwrap()
            if (result._id) {
                setSelectedTopicId(result._id)
                setIsEdit(true)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <ThemeProvider theme={customTheme}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    maxWidth: 1300,
                    margin: "auto",
                    padding: 20,
                    height: 1000
                }}
            >
                <div style={{ width: "30%" }}>
                    <Button style={{ width: "60%", outline: "none" }} variant="outlined" onClick={addTopic}>
                        Add Topic
                    </Button>

                  <IconButton style={{ width: "20%", alignSelf: "center", outline: "none" }}
                              onClick={_ => handleShowGraphChange(false)}>
                    <MdFormatListBulleted />
                  </IconButton>

                  <IconButton style={{ width: "20%", alignSelf: "center", outline: "none" }}
                              onClick={_ => handleShowGraphChange(true)}>
                    <MdDeviceHub />
                  </IconButton>

                  <List dense>
                        {topLevelTopics?.map(topic => (
                            <TopicListItem
                                key={topic._id}
                                topic={topic}
                                setSelectedTopicId={setSelectedTopicId}
                                selectedTopicId={selectedTopicId}
                            />
                        ))}
                  </List>
                </div>
                <Divider orientation="vertical" flexItem />
                <div style={{ width: "65%" }}>
                  {showGraph ? (
                    <div style={{ width: "100%", height:"100%" }}>
                      <TopicsGraph
                        selectedTopicId={selectedTopicId}/>
                    </div>) :
                    (selectedTopicId ? (
                      <TopicDetail
                        topicId={selectedTopicId}
                        handleTopicIdChange={setSelectedTopicId}
                        isEdit={isEdit}
                        handleIsEditChange={handleIsEditChange}
                      />
                    ) : (
                      <h1>Select a topic to browse</h1>
                    ))}
                </div>
            </div>
        </ThemeProvider>
    )
}

export default withRouter(TopicManager)

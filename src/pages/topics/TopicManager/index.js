import React, { useState } from "react"
import { withRouter } from "react-router-dom"
import { Box, Divider, Grid, ThemeProvider } from "@material-ui/core"
import { customTheme } from "../../documents/styles"
import { useNewTopicMutation } from "../../../services/topic"
import TopicManagerSidebar from "./TopicManagerSidebar"
import TopicManagerContent from "./TopicManagerContent"
import { Alert, AlertTitle } from "@material-ui/lab"

function TopicManager() {
    const [newTopic, {error: newTopicError}] = useNewTopicMutation()
    const [selectedTopicId, setSelectedTopicId] = useState(null)
    const [isEdit, setIsEdit] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const error = newTopicError

    const handleIsEditChange = bool => {
        setIsEdit(bool)
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
            <Box margin="auto" alignItems="space-between" maxWidth={1300} padding={5}>
                <Grid item container spacing={2}>
                    <Grid item xs={12}>
                        {error && (
                            <Alert severity="error">
                                <AlertTitle>HTTP Error {error.status}</AlertTitle>
                                {error.message}
                            </Alert>
                        )}
                    </Grid>
                    <Grid item container xs={12}>
                        {isSidebarOpen && (
                            <>
                                <Grid item xs={3}>
                                    <TopicManagerSidebar
                                        addTopic={addTopic}
                                        courseInstanceId={null}
                                        setSelectedTopicId={setSelectedTopicId}
                                        open={isSidebarOpen}
                                        setOpen={setIsSidebarOpen}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Divider style={{margin: "auto"}} orientation="vertical"/>
                                </Grid>
                            </>
                        )}
                        <Grid item xs={8}>
                            <TopicManagerContent
                                selectedTopicId={selectedTopicId}
                                setSelectedTopicId={setSelectedTopicId}
                                isEdit={isEdit}
                                handleIsEditChange={handleIsEditChange}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

export default withRouter(TopicManager)

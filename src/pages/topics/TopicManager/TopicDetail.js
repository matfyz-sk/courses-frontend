import {
    useDeleteTopicMutation,
    useGetTopicsQuery,
    useNewTopicMutation,
    useUpdateTopicMutation,
} from "../../../services/topic"
import React, { useState } from "react"
import TextField from "@material-ui/core/TextField"
import { Box, Button, IconButton, Snackbar, Typography } from "@material-ui/core"
import { MdChevronRight, MdClear, MdDelete, MdDeviceHub, MdEdit, MdExpandMore } from "react-icons/md"
import { withRouter } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import TreeItem from "@material-ui/lab/TreeItem"
import { Alert, TreeView } from "@material-ui/lab"
import Autocomplete from "@material-ui/lab/Autocomplete"

function TopicDetailEditing({ topic, handleEditCancel, handleTopicDelete }) {
    const { data: allTopics } = useGetTopicsQuery()
    const subtopics = allTopics?.filter(a => a.subtopicOf.map(s => s._id).includes(topic._id)) ?? []
    const [updateTopic, { error }] = useUpdateTopicMutation()

    const [name, setName] = useState(topic.name ?? "")
    const [description, setDescription] = useState(topic.description ?? "")
    const [isUpdating, setIsUpdating] = useState(false)

    const debounced = useDebouncedCallback(() => {
        setIsUpdating(false)
        onEdit()
    }, 1000)

    const onSubtopicsChange = (event, values, reason) => {
        // I'm so sorry everyone
        if (reason === "remove-option") {
            // example: subtopics = [1, 2, 3], values = [1, 3]
            // 2 needs to be updated
            const valuesIds = new Set(values.map(v => v._id))
            const toUpdate = subtopics.filter(st => !valuesIds.has(st._id))
            try {
                updateTopic({
                    id: toUpdate[0]._id,
                    body: {
                        subtopicOf: toUpdate[0].subtopicOf
                            .map(s => s._id)
                            .filter(s => s !== topic._id),
                    },
                })
            } catch (err) {
                console.error(err)
            }
        } else if (reason === "select-option") {
            // example: subtopics = [1, 2, 3], values = [1, 2, 3, 4]
            // 4 needs to be updated
            const subtopicIds = new Set(subtopics.map(subtopic => subtopic._id))
            const toUpdate = values.filter(value => !subtopicIds.has(value._id))
            try {
                updateTopic({
                    id: toUpdate[0]._id,
                    body: {
                        subtopicOf: [...toUpdate[0].subtopicOf.map(s => s._id), topic._id],
                    },
                })
            } catch (err) {
                console.error(err)
            }
        }
    }

    const onPrerequisiteChange = (event, values, reason) => {
        try {
            updateTopic({
                id: topic._id,
                body: {
                    topicPrerequisite: values.map(v => v._id),
                },
            })
        } catch (err) {
            console.error(err)
        }
    }

    const onEdit = async () => {
        try {
            await updateTopic({
                id: topic._id,
                body: { name, description },
            })
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <Box display="block" width="100%">
                <Snackbar open={!!error} autoHideDuration={10000}>
                    <Alert severity="error">HTTP Error {error?.status}</Alert>
                </Snackbar>
                <Box display="flex">
                    <TextField
                        label="Topic name"
                        style={{ width: "40%" }}
                        size="small"
                        type="text"
                        value={name}
                        onChange={e => {
                            setIsUpdating(true)
                            debounced(setName(e.target.value))
                        }}
                        variant="outlined"
                    />
                    <IconButton disabled={isUpdating} style={{ marginLeft: "auto" }} onClick={handleEditCancel}>
                        <MdClear />
                    </IconButton>

                    <Button
                        style={{ marginLeft: "2.5em" }}
                        variant="contained"
                        hidden={topic._id === undefined}
                        startIcon={<MdDelete />}
                        onClick={handleTopicDelete}
                        disabled={isUpdating}
                        size={"medium"}
                    >
                        Delete topic
                    </Button>
                </Box>
            </Box>
            <br />
            <TextField
                label="Description"
                style={{ width: "100%" }}
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={e => {
                    setIsUpdating(true)
                    debounced(setDescription(e.target.value))
                }}
            />
            <br />
            <Autocomplete
                multiple
                options={allTopics.filter(t => t._id !== topic._id)}
                getOptionLabel={item => item.name}
                getOptionSelected={(option, value) => option._id === value._id}
                onChange={onSubtopicsChange}
                filterSelectedOptions
                disableClearable
                value={subtopics}
                style={{ width: "100%", border: "0", padding: "0", marginTop: "1em" }}
                renderInput={params => <TextField {...params} label="Subtopics" variant="outlined" />}
            />
            <br />
            <Autocomplete
                multiple
                options={allTopics.filter(t => t._id !== topic._id)}
                getOptionLabel={item => item.name}
                getOptionSelected={(option, value) => option._id === value._id}
                onChange={onPrerequisiteChange}
                filterSelectedOptions
                disableClearable
                value={topic.topicPrerequisite}
                style={{ width: "100%", border: "0", padding: "0" }}
                renderInput={params => <TextField {...params} label="Prerequisites" variant="outlined" />}
            />
        </>
    )
}

function TopicDetail({ topicId, handleTopicIdChange, isEdit, handleIsEditChange }) {
    const { data: allTopics, isFetching } = useGetTopicsQuery()
    const [newTopic, { isError: isAddError }] = useNewTopicMutation()
    const [updateTopic, { isError: isUpdateError }] = useUpdateTopicMutation()
    const [topicDelete, { isError: isDeleteError }] = useDeleteTopicMutation()

    const topic = allTopics?.filter(t => t._id === topicId)[0] ?? {}
    const subtopics = allTopics?.filter(a => a.subtopicOf.map(b => b._id).includes(topic._id)) ?? []

    const onAddSubtopicSubmit = async newName => {
        newTopic({
            name: newName,
            description: "",
            subtopicOf: [topic._id],
            topicPrerequisite: [],
        })
    }

    const onAddPrerequisiteSubmit = async newName => {
        const result = await newTopic({
            name: newName,
            description: "",
            subtopicOf: [],
            topicPrerequisite: [],
        }).unwrap()
        try {
            updateTopic({
                id: topic._id,
                body: {
                    ...topic,
                    topicPrerequisite: [...topic.topicPrerequisite.map(t => t._id), result._id],
                },
            })
        } catch (err) {
            console.log(err)
        }
    }

    const onTopicDelete = async () => {
        try {
            await topicDelete(topic._id)
            handleIsEditChange(false)
            handleTopicIdChange(null)
        } catch (err) {
            console.log(err)
        }
    }

    // Todo handleIsEditChange code smell ? and general cleanup needed here
    return (
        <Box>
            <Box>
                {isEdit ? (
                    <TopicDetailEditing
                        key={topic._id}
                        topic={topic}
                        handleEditCancel={_ => handleIsEditChange(false)}
                        handleTopicDelete={onTopicDelete}
                    />
                ) : (
                    <>
                        <Box display="flex" width="100%">
                            <h2 style={{ width: "70%" }}>{topic.name}</h2>
                            <IconButton
                                style={{ alignSelf: "center", marginLeft: "auto" }}
                                onClick={_ => handleIsEditChange(true)}
                            >
                                <MdEdit />
                            </IconButton>
                            <IconButton style={{ alignSelf: "center" }}>
                                <MdDeviceHub />
                            </IconButton>
                        </Box>
                        <p>{topic.description}</p>
                    </>
                )}
            </Box>
            <br />
            {!isEdit && (
                <>
                    <TreeView
                        disableSelection
                        defaultCollapseIcon={<MdExpandMore />}
                        defaultExpandIcon={<MdChevronRight />}
                    >
                        <TreeItem nodeId="subtopics" label={<Typography variant="h6">Subtopics</Typography>}>
                            {subtopics.map(t => (
                                <TreeItem key={t._id} nodeId={t._id} label={t.name} />
                            ))}
                        </TreeItem>
                    </TreeView>
                    <br />
                    <TreeView
                        disableSelection
                        defaultCollapseIcon={<MdExpandMore />}
                        defaultExpandIcon={<MdChevronRight />}
                    >
                        <TreeItem nodeId="prerequisites" label={<Typography variant="h6">Prerequisites</Typography>}>
                            {topic.topicPrerequisite?.map(t => (
                                <TreeItem key={t._id} nodeId={t._id} label={t.name} />
                            ))}
                        </TreeItem>
                    </TreeView>
                </>
            )}
        </Box>
    )
}

export default withRouter(TopicDetail)

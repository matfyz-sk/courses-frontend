import {
    useDeleteTopicMutation,
    useGetTopicsQuery,
    useNewTopicMutation,
    useUpdateTopicMutation,
} from "../../../services/topic"
import React, { useState } from "react"
import TextField from "@material-ui/core/TextField"
import { Button, IconButton } from "@material-ui/core"
import { MdClear, MdDelete, MdDeviceHub, MdEdit } from "react-icons/md"
import ExpandingListWithSimpleCreate from "./ExpandingListWithSimpleCreate"
import { withRouter } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"

function TopicDetailEditing({ topic, handleEditCancel, handleTopicDelete }) {
    const [updateTopic, { isError: isUpdateError }] = useUpdateTopicMutation()

    const [name, setName] = useState(topic.name ?? "")
    const [description, setDescription] = useState(topic.description ?? "")

    const debounced = useDebouncedCallback(() => onEdit(), 1000)

    const onEdit = async () => {
        try {
            await updateTopic({
                id: topic._id,
                body: { name, description },
            })
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div style={{ display: "flex", width: "100%" }}>
                <TextField
                    label="Topic name"
                    style={{ width: "40%" }}
                    type="text"
                    size="small"
                    value={name}
                    onChange={e => debounced(setName(e.target.value))}
                    variant="outlined"
                />
                <IconButton style={{ marginLeft: "auto", outline: "none" }} onClick={handleEditCancel}>
                    <MdClear />
                </IconButton>
                <Button
                    style={{ marginLeft: "2.5em", outline: "none" }}
                    variant="contained"
                    hidden={topic._id === undefined}
                    startIcon={<MdDelete />}
                    onClick={handleTopicDelete}
                >
                    Delete topic
                </Button>
            </div>
            <br />
            <TextField
                label="Description"
                style={{ width: "100%" }}
                variant="outlined"
                multiline
                rows={3}
                value={description}
                onChange={e => debounced(setDescription(e.target.value))}
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
        <div>
            <div>
                {isEdit ? (
                    <TopicDetailEditing
                        key={topic._id}
                        topic={topic}
                        handleEditCancel={_ => handleIsEditChange(false)}
                        handleTopicDelete={onTopicDelete}
                    />
                ) : (
                    <>
                        <div style={{ display: "flex", width: "100%" }}>
                            <h2 style={{ width: "70%" }}>{topic.name}</h2>
                            <IconButton
                                style={{ alignSelf: "center", marginLeft: "auto", outline: "none" }}
                                onClick={_ => handleIsEditChange(true)}
                            >
                                <MdEdit />
                            </IconButton>
                            <IconButton style={{ alignSelf: "center", outline: "none" }}>
                                <MdDeviceHub />
                            </IconButton>
                        </div>
                        <p>{topic.description}</p>
                    </>
                )}
            </div>
            <ExpandingListWithSimpleCreate
                items={subtopics}
                title="Subtopics"
                isEdit={isEdit}
                handleNewItemSubmit={onAddSubtopicSubmit}
            />
            <ExpandingListWithSimpleCreate
                items={topic.topicPrerequisite ?? []}
                title="Prerequisites"
                isEdit={isEdit}
                handleNewItemSubmit={onAddPrerequisiteSubmit}
            />
        </div>
    )
}

export default withRouter(TopicDetail)

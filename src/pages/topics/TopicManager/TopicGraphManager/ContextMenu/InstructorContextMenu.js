import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import { MdAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import ContextMenu from "./ContextMenu";

import {useDeleteTopicMutation, useNewTopicMutation} from "../../../../../services/topic";

export default function InstructorContextMenu({id, setSelectedTopicId, ...props}) {

  const { getNode, setNodes, setEdges } = useReactFlow();
  const [topicDelete, { isError: isDeleteError }] = useDeleteTopicMutation()
  const [newTopic, {error: newTopicError}] = useNewTopicMutation()


  const addSubtopic = () => {
    newTopic({
      name: "New Topic",
      description: "",
      subtopicOf: [id],
      topicPrerequisite: [],
    }).unwrap().then(result => {
      if (result) {
        setSelectedTopicId(result._id)

        const node = getNode(id)
        const position = {x: 0, y: 0}

        let newNode = {
          ...node,
          id: result._id,
          data: {...node.data, subtopicOf: [id], topicPrerequisite: [], label: 'New topic', type: 'topic'},
          hidden: true,
          position}

        setNodes((nds) => nds.concat(newNode))
      }
    })

  }


  const deleteTopic = async () => {
    await topicDelete(id).unwrap()
      .then(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
        setSelectedTopicId(null);
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <ContextMenu {...props}>
      <button onClick={addSubtopic}><MdAdd /> Add subtopic</button>
      <button onClick={deleteTopic}><MdDelete /> Delete topic</button>
    </ContextMenu>
  );
}

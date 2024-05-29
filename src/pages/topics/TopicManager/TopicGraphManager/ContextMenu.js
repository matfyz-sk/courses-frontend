import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';

import {useDeleteTopicMutation} from "../../../../services/topic";
import { useNewTopicMutation } from "../../../../services/topic"
import {useUpdateUserInfoMutation} from "../../../../services/user";

import { getUserID } from '../../../../components/Auth'

import {useContextMenuStyle} from "./styles";

export default function ContextMenu(
  {id, top, left, right, bottom, setSelectedTopicId, user, ...props}) {

  const contextMenuStyle = useContextMenuStyle()

  const { getNode, setNodes, addNodes, setEdges, getNodes } = useReactFlow();
  const [topicDelete, { isError: isDeleteError }] = useDeleteTopicMutation()
  const [newTopic, {error: newTopicError}] = useNewTopicMutation()
  const [updateUser, updateUserResult] = useUpdateUserInfoMutation()


  const addSubtopic = async () => {
    let result = await newTopic({
          name: "New Topic",
          description: "",
          subtopicOf: [id],
          topicPrerequisite: [],
        }).unwrap()
    if (result) {
      setSelectedTopicId(result._id)

      const node = getNode(id);
      const position = {
        x: 0,
        y: 0,
      };

      let newNode = {...node, id: result._id, data: {subtopicOf: [id], topicPrerequisite: [], label: 'New topic'}, hidden: true, position}
      setNodes((nds) => nds.concat(newNode))
    }
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

  const markAsAchieved = async () => {
    const body = {
      understands: id
    }

    await updateUser({id: user._id, body}).unwrap()
      .then(() => {
      })
      .catch(err => {
        console.log(err)
      })
  }

  const unmarkAsAchieved = async () => {
    const body = {
      understands: user.understands.map(t => t._id).filter(t => t !== id)
    }

    await updateUser({id: user._id, body}).unwrap()
      .then(() => {
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div
      style={{ top, left, right, bottom }}
      className={contextMenuStyle.root}
      {...props}
    >
      <button onClick={addSubtopic}>Add subtopic</button>
      <button onClick={deleteTopic}>Remove topic</button>
      <button>Set as the learning goal</button>
      <button onClick={markAsAchieved}>Goal achieved</button>
      <button onClick={unmarkAsAchieved}>Remove from achieved</button>
    </div>
  );
}

import React, { useCallback } from 'react';
import { useReactFlow } from 'reactflow';
import {useDeleteTopicMutation} from "../../../../services/topic";

export default function ContextMenu(
  {
    id,
    top,
    left,
    right,
    bottom,
    setSelectedTopicId,
    ...props
  }) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const [topicDelete, { isError: isDeleteError }] = useDeleteTopicMutation()
  const addSubtopic = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: 0,
      y: 0,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteTopic = async () => {
    try {
      await topicDelete(id);
      setNodes((nodes) => nodes.filter((node) => node.id !== id));
      setEdges((edges) => edges.filter((edge) => edge.source !== id));
      setSelectedTopicId(null);
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu"
      {...props}
    >
      <button onClick={addSubtopic}>Add subtopic</button>
      <button onClick={deleteTopic}>Remove topic</button>
      <button>Set as the learning goal</button>
    </div>
  );
}

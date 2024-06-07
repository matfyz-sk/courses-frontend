import React, {memo, useCallback, useState} from 'react';
import {Handle, Position, useReactFlow, useStore} from 'reactflow';
import './styles.css'
import {useDebouncedCallback} from "use-debounce";
import {useUpdateTopicMutation} from "../../../../services/topic";

function CustomNode({ id, data }) {
  const [updateTopic, { error }] = useUpdateTopicMutation()

  const showDescription = useStore((s) => s.transform[2] >= 1);
  const { setNodes } = useReactFlow();
  const [name, setName] = useState(data.label ?? "")

  const debouncedUpdateNodeName = useDebouncedCallback((newName) => {
    updateTopic({
      id: id,
      body: { name: newName },
    })
      .unwrap()
      .then((response) => {
        if (response) {
          setNodes((prevNodes) => {
            return prevNodes.map((prevNode) => {
              if (prevNode.id === id) {
                return {
                  ...prevNode,
                  data: {
                    ...prevNode.data,
                    label: newName },
                };
              }

              return prevNode;
            });
          });
        }

        else {
          console.log('topic name could not be updated');
        }
      })
      .catch((error) => console.log(error));
  }, 1000);

  const handleNameChange = useCallback((evt) => {
    const newName = evt.target.value;
    setName(newName);
    debouncedUpdateNodeName(newName);
  }, [debouncedUpdateNodeName]);


  return (
    <div className="custom-node" style={{backgroundColor: data.understood ? data.secondaryColor : data.primaryColor}}>
      <input
        value={name}
        className="custom-node-name"
        onChange={handleNameChange}
      />

      { showDescription && <p className="custom-node-description">{data.description}</p>}
      <Handle type="target" position={Position.Top} id="top" isConnectable={true} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={true} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={true} />
      <Handle type="target" position={Position.Right} id="right" isConnectable={true} />
    </div>
  );
}

export default memo(CustomNode);

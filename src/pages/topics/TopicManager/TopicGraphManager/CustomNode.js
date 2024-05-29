import React, {memo, useCallback} from 'react';
import {Handle, Position, useReactFlow, useStore} from 'reactflow';
import {useCustomNodeStyle} from "./styles";

function CustomNode({ id, data }) {
  const customNodeStyle = useCustomNodeStyle({ background: data.color})

  const zoomSelector = (s) => s.transform[2] >= 1;
  const showContent = useStore(zoomSelector);
  const { setNodes } = useReactFlow();


  const updateNodeName = useCallback((newLabel) =>
    setNodes((prevNodes) => {
        return prevNodes.map((prevNode) => {
          if (prevNode.id === id) {
            return {
              ...prevNode,
              data: {
                ...prevNode.data,
                label: newLabel
              }
            };
          }
          return prevNode;
        });
      }
    ), [setNodes, id]);


  return (
    <div className={customNodeStyle.root}>
      <input
        value={data.label}
        className={customNodeStyle.name}
        onChange={(evt) => updateNodeName(evt.target.value)}
      />
      {/*<p className={customNodeStyle.name}>{data.label}</p>*/}
      { showContent && <p className={customNodeStyle.description}>{data.description}</p>}
      <Handle type="target" position={Position.Top} id="top" isConnectable={true} />
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={true} />
      <Handle type="source" position={Position.Left} id="left" isConnectable={true} />
      <Handle type="target" position={Position.Right} id="right" isConnectable={true} />
    </div>
  );
}

export default memo(CustomNode);

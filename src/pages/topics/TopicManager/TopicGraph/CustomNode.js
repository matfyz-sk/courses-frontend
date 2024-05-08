import React, { memo } from 'react';
import {Handle, Position, useStore} from 'reactflow';
import {useCustomNodeStyle} from "./styles";

function CustomNode({ data }) {
  const customNodeStyle = useCustomNodeStyle({ background: data.color})

  const zoomSelector = (s) => s.transform[2] >= 1;
  const showContent = useStore(zoomSelector);

  return (
    <div className={customNodeStyle.root}>
      <p className={customNodeStyle.name}>{data.label}</p>
      { showContent && <p className={customNodeStyle.description}>{data.description}</p>}
      <Handle type="target" position={Position.Top} isConnectable={true} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={true} />
      <Handle type="source" position={Position.Left} id="c" isConnectable={true} />
      <Handle type="target" position={Position.Right} id="d" isConnectable={true} />
    </div>
  );
}

export default memo(CustomNode);

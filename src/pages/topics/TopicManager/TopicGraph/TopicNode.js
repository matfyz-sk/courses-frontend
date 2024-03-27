import { useCallback } from 'react';
import {Handle, Position, useStore} from 'reactflow';


function TopicNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  const zoomSelector = (s) => s.transform[2] >= 1.5;

  const showContent = useStore(zoomSelector);

  return (
    <div className="topic-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {showContent ?
        (<>
          <p>{data.label}</p>
          <p>Learn more</p>
          </>
        )
        : data.label}
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
      <Handle type="target" position={Position.Left} id="c" isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="d" isConnectable={isConnectable} />
    </div>
  );
}

export default TopicNode;

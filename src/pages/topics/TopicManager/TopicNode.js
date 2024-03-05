import { useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';


function TopicNode({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="topic-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {data.label}
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default TopicNode;

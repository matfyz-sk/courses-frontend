// import React, { useCallback } from 'react';
// import { useReactFlow } from 'reactflow';
//
// export default function ContextMenu(
//   {
//     id,
//     top,
//     left,
//     right,
//     bottom,
//     ...props
//   }) {
//   const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
//   const addSubtopic = useCallback(() => {
//     const node = getNode(id);
//     const position = {
//       x: 0,
//       y: 0,
//     };
//
//     addNodes({ ...node, id: `${node.id}-copy`, position });
//   }, [id, getNode, addNodes]);
//
//   const deleteNode = useCallback(() => {
//     setNodes((nodes) => nodes.filter((node) => node.id !== id));
//     setEdges((edges) => edges.filter((edge) => edge.source !== id));
//   }, [id, setNodes, setEdges]);
//
//   return (
//     <div
//       style={{ top, left, right, bottom }}
//       className="context-menu"
//       {...props}
//     >
//       <button onClick={addSubtopic}>Add subtopic</button>
//       <button onClick={deleteNode}>Remove topic</button>
//       <button>Set as the learning goal</button>
//     </div>
//   );
// }

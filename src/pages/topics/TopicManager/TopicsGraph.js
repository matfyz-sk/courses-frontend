import Dagre from '@dagrejs/dagre';
import React, {useCallback, useEffect} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow, MarkerType, Background
} from 'react-flow-renderer';

// import 'reactflow/dist/style.css';
import {useGetTopicsQuery} from "../../../services/topic";
// import {ConflictAvoidingEdge} from "./ConflictAvoidingEdge";
import TopicNode from "./TopicNode";
import './TopicNode.css';
// import './ContextMenu.css';

// import ContextMenu from './ContextMenu';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  const filteredEdges = edges.filter(edge => edge.type !== 'smart');
  filteredEdges.forEach((edge) => g.setEdge(edge.source, edge.target));

  nodes.forEach((node) => g.setNode(node.id, { width: nodeWidth, height: nodeHeight }));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges: filteredEdges,
  };
};

// const edgeTypes = {
//   smart: ConflictAvoidingEdge,
// }
const nodeTypes = {
  topic: TopicNode,
};


function LayoutFlow({ selectedTopicId}) {
  const { data: allTopics, isFetching } = useGetTopicsQuery()
  const topLevelTopics = allTopics?.filter(topic => topic.subtopicOf.length === 0) ?? []

  const { fitView } = useReactFlow();

  let visualTopics = topLevelTopics?.map(topic => {
    return {
      id: topic._id,
      data: { label: topic.name },
      position: { x: 0, y: 0 },
      type: 'topic',
    };
  });

  let visualEdges = []
  let topics = [...topLevelTopics]

  while (topics.length !== 0 ) {
    let topic = topics.shift()
    let subtopics = allTopics?.filter(a => a.subtopicOf.map(b => b._id).includes(topic._id)) ?? []
    visualTopics = visualTopics.concat(
      subtopics?.map(subtopic => {
        topics.push(subtopic);
        return {
          id: subtopic._id,
          data: { label: subtopic.name },
          position: { x: 0, y: 0 },
          type: 'topic',
        };
      }));
    visualEdges = visualEdges.concat(
      subtopics?.map(subtopic => {
        return {
          id: subtopic._id+'-'+topic._id,
          source: topic._id,
          target: subtopic._id,
          type: 'straight',
          markerStart: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          },
          label: 'is subtopic of',
        }
      })
    )
  }

  const [nodes, setNodes, onNodesChange] = useNodesState(visualTopics);
  const [edges, setEdges, onEdgesChange] = useEdgesState(visualEdges);
  // const [menu, setMenu] = useState(null);
  // const ref = useRef(null);

  // const onNodeContextMenu = useCallback(
  //   (event, node) => {
  //     // Prevent native context menu from showing
  //     event.preventDefault();
  //
  //     // Calculate position of the context menu. We want to make sure it
  //     // doesn't get positioned off-screen.
  //     const pane = ref.current.getBoundingClientRect();
  //     setMenu({
  //       id: node.id,
  //       top: event.clientY < pane.height - 200 && event.clientY,
  //       left: event.clientX < pane.width - 200 && event.clientX,
  //       right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
  //       bottom:
  //         event.clientY >= pane.height - 200 && pane.height - event.clientY,
  //     });
  //   },
  //   [setMenu],
  // );

  // // Close the context menu if it's open whenever the window is clicked.
  // const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      let topics = [...topLevelTopics]

      while (topics.length !== 0 ) {
        let topic = topics.shift()
        let prerequisities = allTopics?.filter(a => a.topicPrerequisite.map(b => b._id).includes(topic._id)) ?? []
        layouted.edges = layouted.edges.concat(
          prerequisities?.map(prereq => {
            return {
              id: prereq._id+'-'+topic._id,
              source: topic._id,
              target: prereq._id,
              type: 'straight',
              markerStart: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20,
              }
            }
          })
        )
      }

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

    },
    [nodes, edges]
  );
  useEffect(()=>{fitView({nodes: [{id: selectedTopicId}]});}, [selectedTopicId])

  useEffect(() => {
    onLayout('TB');
  }, []);


  return (
    <ReactFlow
      // ref={ref}
      nodes={nodes}
      edges={edges}
      // edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      // onNodeContextMenu={onNodeContextMenu}
      fitView
    >
      {/*<Background />*/}
      {/*{menu && <ContextMenu onClick={onPaneClick} {...menu} />}*/}
    </ReactFlow>
  );
}

export default function ({selectedTopicId}) {
  console.log("loading graph", selectedTopicId);
  return (
    <ReactFlowProvider>
      <LayoutFlow
        selectedTopicId={selectedTopicId}/>
    </ReactFlowProvider>
  );
}

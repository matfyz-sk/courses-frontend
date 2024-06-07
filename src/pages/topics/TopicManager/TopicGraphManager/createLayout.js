import { useEffect } from 'react';
import {
  useReactFlow,
  useNodesInitialized,
  useStore,
} from 'reactflow';
import Dagre from "@dagrejs/dagre";

const NODE_WIDTH = 250;
const NODE_HEIGHT = 150;


function createLayout() {
  const { setNodes, setEdges } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const elements = useStore(
    (state) => ({
      nodeMap: state.nodeInternals,
      edgeMap: state.edges.reduce(
        (acc, edge) => acc.set(edge.id, edge),
        new Map()
      ),
    }),
    compareElements
  );

  // returns nodes with new positions, and size of the new graph
  const layoutElements = (nodes, edges, direction) => {
    let g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({rankdir: direction, nodesep: 150, edgesep: 70, ranksep: 70});

    nodes.forEach((node) => {
      g.setNode(node.id, {
        width: node.style?.width || NODE_WIDTH,
        height: node.style?.height || NODE_HEIGHT})}
    );
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    Dagre.layout(g);
    const graphInfo = g.graph();

    return {
      nodes: (
        nodes.map((node) => {
            const { x, y, width, height } = g.node(node.id);
            return { ...node, position: {
              x: x - width / 2,
              y: y - height / 2 }
            };
          }
        )),
      size: {width: graphInfo.width, height: graphInfo.height}
    }
  };

  useEffect(() => {
    if (!nodesInitialized || elements.nodeMap.size === 0) {
      return;
    }

    const runLayout = () => {
      const nodes = [...elements.nodeMap.values().filter((n) => n.type !== 'group' && n.data.type !== 'event')];
      const eventNode = [...elements.nodeMap.values().filter((n) => n.data?.type === 'event')];

      let topicNodeTrees = []
      let subtopicEdges = []
      let i = 0

      let topNodes = nodes?.filter(node => node.data?.subtopicOf?.length === 0) ?? []
      topNodes.forEach(node => {
        topicNodeTrees[i] = []
        subtopicEdges[i] = []

        // graph nodes from base topics
        let topics = []
        topics[0] = node
        topicNodeTrees[i].push({...node, hidden: false});

        // graph nodes from subtopics, saved to topicNodeTrees
        while (topics.length !== 0) {
          let topic = topics.shift()
          let subtopics = nodes?.filter(a => a.data?.subtopicOf?.includes(topic.id)) ?? []
          topicNodeTrees[i] = topicNodeTrees[i].concat(
            subtopics?.map(subtopic => {
              topics.push(subtopic);
              return {...subtopic, hidden:false};
            }));

          // edges from subtopic relations
          subtopicEdges[i] = subtopicEdges[i].concat(
            subtopics?.map(subtopic => {
                return {
                  id: subtopic.id+'-'+topic.id,
                  source: topic.id,
                  target: subtopic.id,
                  type: 'straight',
                }
              }
            ))
        }
        i++;
      })


      // layouts topic trees' internal structures, computes trees' sizes
      let layouted = {nodes: [], sizes: []}
      for (let i = 0; i < topicNodeTrees.length; i++) {
        let topicTree = topicNodeTrees[i]
        let topicTreeEdges = subtopicEdges[i]

        let l = layoutElements(topicTree, topicTreeEdges, 'TB')
        layouted.nodes[i] = l.nodes
        layouted.sizes[i] = l.size
      }

      // 'group' type graph nodes for topic trees (only for layouting purposes, won't be visible)
      let parentNodes = []
      let topParents = []
      for (let i = 0; i < layouted.nodes.length; i++) {
        let {width, height} = layouted.sizes[i]
        let parentNode = {
          id: 'tree'+ i,
          position: { x: 0, y: 0 },
          style: { backgroundColor: 'rgba(0, 255, 0, 0.2)', width: width, height: height},
          type: 'group',
          hidden: true
        }
        parentNodes[i] = parentNode
        layouted.nodes[i].forEach(node => {
          node.parentNode = parentNode.id;
          topParents[node.id] = parentNode.id
        })
      }


      // edges from prerequisite relations between whole topic trees
      let prereqGroupEdges = []
      nodes.forEach(topic => {
        let prerequisities = nodes?.filter(a => a.data?.topicPrerequisite?.includes(topic.id)) ?? []
        prereqGroupEdges = prereqGroupEdges.concat(
          prerequisities?.map(prereq => {
            let topicGroupId = topParents[topic.id]
            let prereqGroupId = topParents[prereq.id]
            return {
              id: 'layout-' + prereqGroupId + '-' + topicGroupId,
              source: topicGroupId,
              target: prereqGroupId,
            }}))})

      let layoutedTrees = layoutElements(parentNodes.concat(eventNode), prereqGroupEdges, 'LR')

      // real graph edges from prerequisite relations between topics
      let prereqEdges = []
      nodes.forEach(topic => {
        let prerequisities = topic.data?.topicPrerequisite ?? []
        prereqEdges = prereqEdges.concat(
          prerequisities?.map(prereq => {
            return {
              id: prereq + '-' + topic.id,
              source: topic.id,
              target: prereq,
              type: 'smart',
              sourceHandle: 'left',
              targetHandle: 'right',
            }}))})


      let newNodes = layoutedTrees.nodes.concat([].concat(...layouted.nodes))
      setNodes(newNodes);
      setEdges(prereqEdges.concat([].concat(...subtopicEdges)))
    };

    runLayout();
  }, [nodesInitialized, elements, setNodes, setEdges]);
}

export default createLayout;

function compareElements(xs, ys) {
  return (
    compareNodes(xs.nodeMap, ys.nodeMap)
  );
}

function compareNodes(xs, ys) {
  return (xs.size === ys.size);
}

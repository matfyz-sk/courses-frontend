import Dagre from '@dagrejs/dagre';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow, MarkerType, Background
} from 'reactflow';

import {Box, IconButton} from "@material-ui/core";
import { MdFormatAlignLeft } from "react-icons/md";

import {useGetTopicsQuery} from "../../../../services/topic";

import {ConflictAvoidingEdge} from "./ConflictAvoidingEdge";
import TopicNode from "./TopicNode";
import ContextMenu from './ContextMenu';

import 'reactflow/dist/style.css';
import './TopicNode.css';
import './ContextMenu.css';


const nodeWidth = 200;
const nodeHeight = 100;

const edgeTypes = {
  smart: ConflictAvoidingEdge,
};

const nodeTypes = {
  topic: TopicNode,
};

const getLayoutedElements = (nodes, edges, options) => {
    let g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({rankdir: options.direction, nodesep: 70, edgesep: 50, ranksep: 70});
    nodes.forEach((node) => g.setNode(node.id, {width: node?.style?.width || nodeWidth, height: node?.style?.height || nodeHeight}));
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));

    Dagre.layout(g);
    let graphInfo = g.graph();

  return {
    nodes: (
      nodes.map((node) => {
          let { x, y } = g.node(node.id);
          return { ...node, position: { x: x-100, y: y-50 } };
        }
      )),
    sizes: {width: graphInfo.width, height: graphInfo.height}
  }
};


function LayoutFlow({ selectedTopicId, setSelectedTopicId}) {
  const { data: allTopics } = useGetTopicsQuery()
  const topLevelTopics = allTopics?.filter(topic => topic.subtopicOf.length === 0) ?? []
  const { fitView } = useReactFlow();

  let topicNodeTrees = []
  let subtopicEdges = []
  let i = 0

  topLevelTopics.forEach(baseTopic => {
    topicNodeTrees[i] = []
    subtopicEdges[i] = []

    let topics = []
    topics[0] = baseTopic
    topicNodeTrees[i].push(
      {
          id: baseTopic._id,
          data: { label: baseTopic.name },
          position: { x: 0, y: 0 },
          type: 'topic',
        }
      );

    while (topics.length !== 0) {
      let topic = topics.shift()
      let subtopics = allTopics?.filter(a => a.subtopicOf.map(b => b._id).includes(topic._id)) ?? []
      topicNodeTrees[i] = topicNodeTrees[i].concat(
        subtopics?.map(subtopic => {
          topics.push(subtopic);
          return {
            id: subtopic._id,
            data: { label: subtopic.name },
            position: { x: 0, y: 0 },
            type: 'topic',
          };
        }));

      subtopicEdges[i] = subtopicEdges[i].concat(
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
            }
          }
        }
      ))
    }
    i++;
  })


  const [nodes, setNodes, onNodesChange] = useNodesState([].concat(...topicNodeTrees));
  const [edges, setEdges, onEdgesChange] = useEdgesState([].concat(...subtopicEdges));

  const createLayout = useCallback(
    () => {
      let layouted = {nodes: [], sizes: []}
      for (let i = 0; i < topicNodeTrees.length; i++) {
        let topicTree = topicNodeTrees[i]
        let topicTreeEdges = subtopicEdges[i]

        let l = getLayoutedElements(topicTree, topicTreeEdges, {direction: 'TB'})
        layouted.nodes[i] = l.nodes
        layouted.sizes[i] = l.sizes
      }


      let parentNodes = []
      let topParents = []
      for (let i = 0; i < layouted.nodes.length; i++) {
        let {width, height} = layouted.sizes[i]
        let parentNode = {
          id: 'tree'+ i,
          position: { x: 0, y: 0 },
          style: { backgroundColor: 'rgba(0, 255, 0, 0.2)', width: width, height: height},
          type: 'group'
        }
        parentNodes[i] = parentNode
        layouted.nodes[i].forEach(node => {
          node.parentNode = parentNode.id;
          topParents[node.id] = parentNode.id
        })
      }

      let prereqGroupEdges = []
      allTopics.forEach(topic => {
        let prerequisities = allTopics?.filter(a => a.topicPrerequisite.map(b => b._id).includes(topic._id)) ?? []
        prereqGroupEdges = prereqGroupEdges.concat(
            prerequisities?.map(prereq => {
              let topicGroupId = topParents[topic._id]
              let prereqGroupId = topParents[prereq._id]
              return {
                id: 'layout-' + prereqGroupId + '-' + topicGroupId,
                source: topicGroupId,
                target: prereqGroupId,
              }}))})

      let layoutedTrees = getLayoutedElements(parentNodes, prereqGroupEdges, {direction: 'LR'})

      let prereqEdges = []
      allTopics.forEach(topic => {
        let prerequisities = allTopics?.filter(a => a.topicPrerequisite.map(b => b._id).includes(topic._id)) ?? []
        prereqEdges = prereqEdges.concat(
          prerequisities?.map(prereq => {
            return {
              id: prereq._id + '-' + topic._id,
              source: topic._id,
              target: prereq._id,
              type: 'smart',
              sourceHandle: 'd',
              targetHandle: 'c',
              markerStart: {
                type: MarkerType.ArrowClosed,
                width: 20,
                height: 20
              }
            }}))})


      let newNodes = layoutedTrees.nodes.concat([].concat(...layouted.nodes))
      setNodes(newNodes);
      setEdges(prereqEdges.concat([].concat(...subtopicEdges)))
    },
    []
  );

  useEffect(() => {
    createLayout();
    fitView({nodes: [{id: selectedTopicId}]});
  }, []);


  useEffect(()=>{fitView({nodes: [{id: selectedTopicId}]})}, [selectedTopicId])

  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();
      let x = event.clientX - pane.left;
      let y = event.clientY - pane.top;

      setMenu({
        id: node.id,
        top: y < pane.height - 200 && y,
        left: x < pane.width - 200 && x,
        right: x >= pane.width - 200 && pane.width - x,
        bottom: y >= pane.height - 200 && pane.height - y,
      });
    },
    [setMenu],
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <ReactFlow
      ref={ref}
      nodes={nodes}
      edges={edges}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPaneClick}
      onNodeContextMenu={onNodeContextMenu}
      minZoom={0.01}
      fitView
    >
      <Background />
      {menu && <ContextMenu setSelectedTopicId={setSelectedTopicId} onClick={onPaneClick} {...menu} />}
    </ReactFlow>
  );
}

export default function TopicGraph ({selectedTopicId, setSelectedTopicId, setShowGraph}) {
  return (
    <>
      <Box display="flex" width="100%">
        <h2 style={{ width: "70%" }}></h2>
        <IconButton
          style={{ alignSelf: "center", marginLeft: "auto" }}
          onClick={_ => setShowGraph(false)}>
          <MdFormatAlignLeft />
        </IconButton>
      </Box>
      <ReactFlowProvider>
        <LayoutFlow
          selectedTopicId={selectedTopicId}
          setSelectedTopicId={setSelectedTopicId}/>
      </ReactFlowProvider>
    </>
  );
}

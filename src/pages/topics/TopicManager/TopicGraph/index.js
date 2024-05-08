import Dagre from '@dagrejs/dagre';
import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow, MarkerType, Background, Panel, Controls, useNodesInitialized
} from 'reactflow';

import {Box, IconButton} from "@material-ui/core";
import { MdFormatAlignLeft, MdLightbulbOutline } from "react-icons/md";

import {useGetTopicsQuery} from "../../../../services/topic";
import { getUserID, getUser } from '../../../../components/Auth';
import {useGetUserQuery, useUpdateUserInfoMutation} from "../../../../services/user";


import {ConflictAvoidingEdge} from "./ConflictAvoidingEdge";
import CustomNode from "./CustomNode";
import ContextMenu from './ContextMenu';

import 'reactflow/dist/style.css';
import {useTipsPanelStyle} from "./styles";
import {reason} from "../../../../services/Reasoner/reason";


const nodeWidth = 250;
const nodeHeight = 150;

const edgeTypes = {
  smart: ConflictAvoidingEdge };

const nodeTypes =
  { custom: CustomNode };

// returns nodes with new positions and their sizes
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
          return { ...node, position: { x: x-nodeWidth/2, y: y-nodeHeight/2 } };
        }
      )),
    sizes: {width: graphInfo.width, height: graphInfo.height}
  }
};

const createCustomNode = (element, user) => {
  let understands = user?.understands?.includes(element._id)
  return {
    id: element._id,
    data: {
      label: element.name,
      description: element.description,
      color: understands ? element['isVisualizedBy']['hasSecondaryColor'] : element['isVisualizedBy']['hasPrimaryColor'],
      shape: element['isVisualizedBy'].hasShape
    },
    position: { x: 0, y: 0 },
    type: 'custom',
  }
}


function LayoutFlow({ selectedElementId, setSelectedTopicId}) {
  // console.log("new layoutFlow")
  const {data: user, userIsLoading} = useGetUserQuery({id: getUserID()})

  // console.log(user)

  const { data: allTopics, isLoading, isFetching } = useGetTopicsQuery() ?? []
  if (isFetching)
    console.log("loading") ;
  let topicsWithVisualProperties = reason(allTopics)
  const topLevelTopics = topicsWithVisualProperties?.filter(topic => topic.subtopicOf.length === 0) ?? []

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { fitView } = useReactFlow();

  const createLayout = useCallback(
    () => {
      let topicNodeTrees = []
      let subtopicEdges = []
      let i = 0

      topLevelTopics.forEach(baseTopic => {
        topicNodeTrees[i] = []
        subtopicEdges[i] = []

        // graph nodes from base topics
        let topics = []
        topics[0] = baseTopic
        topicNodeTrees[i].push(
          createCustomNode(baseTopic, user)
        );

        // graph nodes from subtopics, saved to topicNodeTrees
        while (topics.length !== 0) {
          let topic = topics.shift()
          let subtopics = topicsWithVisualProperties?.filter(a => a.subtopicOf.map(b => b._id).includes(topic._id)) ?? []
          topicNodeTrees[i] = topicNodeTrees[i].concat(
            subtopics?.map(subtopic => {
              topics.push(subtopic);
              return createCustomNode(subtopic, user);
            }));

          // edges from subtopic relations
          subtopicEdges[i] = subtopicEdges[i].concat(
            subtopics?.map(subtopic => {
                return {
                  id: subtopic._id+'-'+topic._id,
                  source: topic._id,
                  target: subtopic._id,
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

        let l = getLayoutedElements(topicTree, topicTreeEdges, {direction: 'TB'})
        layouted.nodes[i] = l.nodes
        layouted.sizes[i] = l.sizes
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
      topicsWithVisualProperties.forEach(topic => {
        let prerequisities = topicsWithVisualProperties?.filter(a => a.topicPrerequisite.map(b => b._id).includes(topic._id)) ?? []
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

      // real graph edges from prerequisite relations between topics
      let prereqEdges = []
      topicsWithVisualProperties.forEach(topic => {
        let prerequisities = topic.topicPrerequisite
        prereqEdges = prereqEdges.concat(
          prerequisities?.map(prereq => {
            return {
              id: prereq._id + '-' + topic._id,
              source: topic._id,
              target: prereq._id,
              type: 'smart',
              sourceHandle: 'c',
              targetHandle: 'd',
            }}))})


      let newNodes = layoutedTrees.nodes.concat([].concat(...layouted.nodes))
      setNodes(newNodes);
      // console.log("resetting to new nodes", nodes)
      setEdges(prereqEdges.concat([].concat(...subtopicEdges)))
    },
    [nodes]
  );

  useEffect(() => {
    createLayout();
  }, []);


  useEffect(()=>{
    console.log("fitting view to ", selectedElementId)
    fitView({nodes: [{id: selectedElementId}], duration: 1000})
  }, [selectedElementId])


  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onNodeContextMenu = useCallback(
    (event, node) => {
      if (node.type === "group") {
        return
      }
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

  const highlightEdges = useCallback((node) => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => {
        if (edge.source === node.id && edge.type === 'smart') {
          return {
            ...edge,
            label: 'hasPrerequisite',
            style: {
              stroke: 'orange',
              strokeWidth: '4px'
            }
          };
        } else {
          return edge;
        }
      });
    });
  }, []);

  const dehighlightEdges = useCallback(() => {
    setEdges((prevEdges) => {
      return prevEdges.map((edge) => ({
        ...edge,
        label: '',
        style: {stroke: '#b1b1b7' },
      }));
    });
  }, []);

  const highlightNode = useCallback((node) => {
    setSelectedTopicId(null);
    console.log("resetting selected topic id", selectedElementId)
    setSelectedTopicId(node.id);
    console.log("setting selected topic id", selectedElementId)
    setNodes((prevNodes) => {
      return prevNodes.map((prevNode) => {
        if (prevNode.id === node.id) {
          return {
            ...prevNode,
            style: {
              borderColor: 'orange',
              strokeWidth: '4px'
            }
          };
        } else {
          return prevNode;
        }
      });
    });
  }, []);



  const tipsPanelStyle = useTipsPanelStyle()
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
      onNodeMouseEnter={(_event, node) => highlightEdges(node)}
      onNodeMouseLeave={() => dehighlightEdges()}
      onNodeClick={(_event, node) => highlightNode(node)}
      minZoom={0.01}
      connectionMode="loose"
      nodesDraggable={false}
      fitView
    >
      <Background />
      {menu && <ContextMenu setSelectedTopicId={setSelectedTopicId} onClick={onPaneClick} {...menu} />}
      <Panel position="top-left" className={tipsPanelStyle.root}>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Left click on topic to see options</p>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Hover over topic to highlight prerequisites</p>
      </Panel>
    </ReactFlow>
  );
}



export default function TopicGraph ({selectedElementId, setSelectedTopicId, setShowGraph}) {
  console.log("topics graph")
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
          selectedElementId={selectedElementId}
          setSelectedTopicId={setSelectedTopicId}/>
      </ReactFlowProvider>
    </>
  );
}

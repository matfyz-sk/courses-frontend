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

import createLayout from "./createLayout";
import {createCustomNode} from "./functions";

const edgeTypes = {
  smart: ConflictAvoidingEdge };

const nodeTypes =
  { custom: CustomNode };


function LayoutFlow({ selectedElementId, setSelectedTopicId}) {
  const {data: user, userIsLoading} = useGetUserQuery({id: getUserID()})

  const { data: allTopics, isLoading, isFetching } = useGetTopicsQuery() ?? []
  let topicsWithVisualProperties = reason(allTopics)
  const topLevelTopics = topicsWithVisualProperties?.filter(topic => topic.subtopicOf.length === 0) ?? []


  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(topicsWithVisualProperties.map(
    (topic) => {
      let topicNode = createCustomNode(topic, user)
      topicNode.data.subtopicOf = topic.subtopicOf.map(t => t._id)
      topicNode.data.topicPrerequisite = topic.topicPrerequisite.map(t => t._id)
      return topicNode;
    }));
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  createLayout();

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

import React, {useCallback, useEffect, useState, useRef, useMemo} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow, MarkerType, Background, Panel, Controls, useNodesInitialized
} from 'reactflow';

import { Box } from "@material-ui/core";
import { MdLightbulbOutline } from "react-icons/md";

import {useGetTopicsQuery} from "../../../../services/topic";
import {useGetMaterialsQuery} from "../../../../services/documentsGraph";
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


function LayoutFlow({ topics, selectedElementId, setSelectedTopicId}) {
  // const { data: allMaterials } = useGetMaterialsQuery() ?? []
  const {data: user, isSuccess: isUserSuccess} = useGetUserQuery({id: getUserID()})
  // if (isUserSuccess) console.log(user)

  let topicsWithVisualProperties = reason(topics)
  // let materialsWithVisualProperties = reason(allMaterials)
  // console.log(materialsWithVisualProperties)
  //
  // let entitiesWithVisualProperties = topicsWithVisualProperties.concat(materialsWithVisualProperties)


  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  if (topics.length > 0 && nodes.length === 0 && isUserSuccess) {
    console.log("pomoc", topics)
    setNodes(topicsWithVisualProperties.map(
      (topic) => {
        let topicNode = createCustomNode(topic, user[0])
        topicNode.data.subtopicOf = topic.subtopicOf.map(t => t._id)
        topicNode.data.topicPrerequisite = topic.topicPrerequisite.map(t => t._id)
        return topicNode;
      }))
  }

  const { fitView } = useReactFlow();

  console.log("rerendering LayoutFlow", nodes)

  createLayout();

  useEffect(()=>{
    selectedElementId
      ? fitView({nodes: [{id: selectedElementId}], duration: 1000})
      : fitView({duration: 1000})

  }, [selectedElementId, nodes])


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
    // console.log("resetting selected topic id", selectedElementId)
    setSelectedTopicId(node.id);
    // console.log("setting selected topic id", selectedElementId)
    // setNodes((prevNodes) => {
    //   return prevNodes.map((prevNode) => {
    //     if (prevNode.id === node.id) {
    //       return {
    //         ...prevNode,
    //         style: {
    //           border: '2px solid orange'
    //         }
    //       };
    //     } else {
    //       return prevNode;
    //     }
    //   });
    // });
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
      {menu && <ContextMenu user={user[0]} setSelectedTopicId={setSelectedTopicId} onClick={onPaneClick} {...menu} />}
      <Panel position="top-left" className={tipsPanelStyle.root}>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Left click on node to see options</p>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Hover over topic to highlight prerequisites</p>
      </Panel>
    </ReactFlow>
  );
}



function TopicGraph ({topics, selectedElementId, setSelectedTopicId}) {
  console.log("topics graph")
  return (
    <>
      <Box display="flex" width="100%">
        <h2 style={{ width: "70%" }}></h2>
      </Box>

      <ReactFlowProvider>
        <LayoutFlow
          topics={topics}
          selectedElementId={selectedElementId}
          setSelectedTopicId={setSelectedTopicId}/>
      </ReactFlowProvider>
    </>
  );
}

export default TopicGraph

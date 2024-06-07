import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactFlow, {Background, Panel, useEdgesState, useNodesState, useReactFlow} from 'reactflow';

import {MdLightbulbOutline} from "react-icons/md";

import {getUserID} from '../../../../components/Auth';
import {useGetUserQuery} from "../../../../services/user";

import {ConflictAvoidingEdge} from "./ConflictAvoidingEdge";
import CustomNode from "./CustomNode";
import createLayout from "./createLayout";
import {createCustomNode} from "./functions";

import StudentContextMenu from './ContextMenu/StudentContextMenu'
import InstructorContextMenu from './ContextMenu/InstructorContextMenu'

import 'reactflow/dist/style.css';
import {useTipsPanelStyle} from "./styles";
import {reason} from "../../../../services/Reasoner/reason";

import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

const edgeTypes = { smart: ConflictAvoidingEdge };
const nodeTypes = { custom: CustomNode };


function TopicGraph({ topics, event, selectedElementId, setSelectedTopicId, privileges}) {
  const {data: user, isSuccess: isUserSuccess} = useGetUserQuery({id: getUserID()})

  let topicsWithVisualProperties = reason(topics)
  let eventWithVisualProperties = reason(event)

  // for now, since the topics UI is global now and is not tied to any course
  const canEdit = privileges.inGlobal === 'admin'

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  if (topics.length > 0 && nodes.length === 0 && isUserSuccess) {
    let initialNodes = topicsWithVisualProperties.map(
      (topic) => {
        let topicNode = createCustomNode(topic, user[0])
        topicNode.data.subtopicOf = topic.subtopicOf.map(t => t._id)
        topicNode.data.topicPrerequisite = topic.topicPrerequisite.map(t => t._id)
        topicNode.data.type = 'topic'
        return topicNode;
      })

    if (event) {
      const eventNode = createCustomNode(eventWithVisualProperties[0])
      eventNode.data.type = 'event'
      initialNodes = initialNodes.concat(eventNode)
    }

    setNodes(initialNodes)
  }

  const { fitView } = useReactFlow();

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
      if (node.type === "group" || node.data.type !== 'topic') {
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
    if (setSelectedTopicId) {
      setSelectedTopicId(node.id);
    }
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
      {menu && (canEdit ? <InstructorContextMenu setSelectedTopicId={setSelectedTopicId}
                                              onClick={onPaneClick} {...menu} />
                        : <StudentContextMenu user={user[0]}
                                              onClick={onPaneClick} {...menu} />)}
      <Panel position="top-left" className={tipsPanelStyle.root}>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Left click on node to see options</p>
        <p><MdLightbulbOutline className={tipsPanelStyle.icon}/> Hover over topic to highlight prerequisites</p>
      </Panel>
    </ReactFlow>
  );
}


const mapStateToProps = ({ privilegesReducer, userReducer }) => {
  const privileges = privilegesReducer
  const user = userReducer
  return {
    privileges,
    user
  }
}

export default withRouter(connect(mapStateToProps)(TopicGraph))

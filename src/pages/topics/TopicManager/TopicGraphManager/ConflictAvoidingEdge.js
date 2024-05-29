import React from 'react'
import { useNodes, BezierEdge, StraightEdge, MarkerType } from 'reactflow'
import { getSmartEdge } from '@tisoap/react-flow-smart-edge'

export function ConflictAvoidingEdge(props) {
  const {
    id,
    source,
    target,
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    markerStart,
    markerEnd,
  } = props

  const allNodes = useNodes()
  const sourceNode = allNodes.filter(node => node.id === source)[0]
  const targetNode = allNodes.filter(node => node.id === target)[0]

  // can conflict with target and source group nodes
  const nodes = allNodes.filter(node => node.id !== sourceNode.parentNode && node.id !== targetNode.parentNode);

  const myOptions = {
    nodePadding: 20
  }

  const smartEdge = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
    options: myOptions
  })

  if (smartEdge === null) {
    return <StraightEdge {...props} />
  }

  const { svgPathString } = smartEdge

  return (
    <>
      <path
        style={style}
        className='react-flow__edge-path'
        d={svgPathString}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    </>
  )
}

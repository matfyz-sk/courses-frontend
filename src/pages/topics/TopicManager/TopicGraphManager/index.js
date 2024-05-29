import React from "react"
import TopicGraph from "./TopicGraph"

import {useGetEventByTypeQuery} from "../../../../services/event";
import {getFullID} from "../../../../helperFunctions";
import {useGetTopicsQuery} from "../../../../services/topic";


function TopicGraphManager({selectedElementId, setSelectedElementId, eventId}) {
  let topics = []
  const {
    data: allTopics,
    isSuccess: isTopicsSuccess,
    isLoading: isTopicsLoading
  } = useGetTopicsQuery() ?? []

  const {
    data: event,
    isSuccess: isEventSuccess,
    isLoading: isEventLoading
  } = useGetEventByTypeQuery({id: getFullID(eventId, 'Block'), type: 'Block'}
  , {skip: !eventId}) ?? []

  if (isEventLoading || isTopicsLoading) {
    return "Loading..."
  }

  if (isTopicsSuccess) {
    topics = allTopics
  }

  if (eventId && isEventSuccess) {
      const topicIds = event[0].requires
      topics = allTopics.filter(t1 => topicIds.some(t2 => t2._id === t1._id))
      console.log()
  }

  return (
    <TopicGraph
      topics={topics}
      selectedElementId={selectedElementId}
      setSelectedTopicId={setSelectedElementId}/>
  )
}

export default TopicGraphManager

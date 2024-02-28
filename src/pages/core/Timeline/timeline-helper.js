import { getDisplayDateTime, getShortId, mergeMaterials } from '../Helper'
import { SESSIONS, TASKS_DEADLINES, TASKS_EXAMS } from '../constants'

export const sortEventsFunction = (e1, e2) => {
  if (new Date(e1.startDate.millis) > new Date(e2.startDate.millis)) {
    return 1
  }
  if (new Date(e1.startDate.millis) < new Date(e2.startDate.millis)) {
    return -1
  }
  if (e1.type > e2.type) {
    return 1
  }
  if (e1.type < e2.type) {
    return -1
  }
  return 0
}

export const greaterEqual = (dateTime1, dateTime2) => {
  return new Date(dateTime1) >= new Date(dateTime2)
}

export const greater = (dateTime1, dateTime2) => {
  return new Date(dateTime1) > new Date(dateTime2)
}

export const getEvents = data => {
  return data.map(eventData => {
    const event = {
      id: getShortId(eventData['_id']),
      fullId: eventData['_id'],
      type: typeof eventData['_type'] === 'string' ? eventData['_type'].split('#')[1] : '',
      name: eventData.name,
      description: eventData.description ? eventData.description : '',
      startDate: new Date(eventData.startDate.millis),
      endDate: new Date(eventData.endDate.millis),
      place: eventData.location ? eventData.location : '',
      uses: eventData.uses.map(material => {
        return {
          id: getShortId(material['_id']),
          fullId: material['_id'],
          name: material.name,
        }
      }),
      recommends: eventData.recommends.map(material => {
        return {
          id: getShortId(material['_id']),
          fullId: material['_id'],
          name: material.name,
        }
      }),
      documentReference: eventData.documentReference,
      courseAbbr: eventData.courseInstance.course
        ? eventData.courseInstance.course.abbreviation
        : '',
      courseInstance: eventData.courseInstance['_id'],
      instructors: eventData.courseInstance
        ? eventData.courseInstance.hasInstructor
        : eventData.hasInstructor,
    }
    event.materials = mergeMaterials(event.uses, event.recommends)
    return event
  })
}

export const getTimelineBlocks = events => {
  const timelineBlocks = []
  timelineBlocks.push(events[0])
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < events.length; i++) {
    const event = events[i]
    const block = timelineBlocks[timelineBlocks.length - 1]
    if (
      event.type === 'Block' ||
      new Date(event.startDate) >= new Date(block.endDate) ||
      block.type !== 'Block'
    ) {
      timelineBlocks.push(event)
    }
  }
  return timelineBlocks
}

export const getCurrentBlock = blocks => {
  let currentBlock = blocks[0]
  for (let block of blocks) {
    if (block.startDate >= new Date()) {
      return currentBlock.id
    }
    currentBlock = block
  }
  return currentBlock.id
}

export const getNestedEvents = (events, timelineBlocks) => {
  if (events.length === 0 || timelineBlocks === 0) {
    return timelineBlocks
  }
  for (const block of timelineBlocks) {
    if (block.type === 'Block') {
      block.sessions = []
      block.tasks = []

      for (const event of events) {
        if (block.id !== event.id && event.type !== 'Block') {
          if (
            SESSIONS.includes(event.type) &&
            ((greaterEqual(event.startDate, block.startDate) &&
              !greaterEqual(event.startDate, block.startDate)) ||
              (greater(event.endDate, block.startDate) &&
                !greater(event.endDate, block.endDate)))
          ) {
            event.displayDateTime = getDisplayDateTime(event.startDate, false)
            block.sessions.push(event)
            block.materials = mergeMaterials(block.materials, event.materials)
          } else if (
            (TASKS_EXAMS.includes(event.type) &&
              greaterEqual(event.startDate, block.startDate) &&
              !greaterEqual(event.startDate, block.endDate)) ||
            (TASKS_DEADLINES.includes(event.type) &&
              greater(event.endDate, block.startDate) &&
              !greater(event.endDate, block.endDate))
          ) {
            if (TASKS_EXAMS.includes(event.type)) {
              event.displayDateTime = getDisplayDateTime(event.startDate, false)
            } else {
              event.displayDateTime = getDisplayDateTime(event.endDate, false)
            }
            block.tasks.push(event)
            block.materials = mergeMaterials(block.materials, event.materials)
          }
        }
      }
    }
  }
  return timelineBlocks
}

export const addDays = (date, days) => {
  let result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const dateDiffInDays = (a, b) => {
  const MSPERDAY = 1000 * 60 * 60 * 24
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

  return Math.floor((utc2 - utc1) / MSPERDAY)
}

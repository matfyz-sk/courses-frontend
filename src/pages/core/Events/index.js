import React from 'react'

import { ListGroup, ListGroupItem } from 'reactstrap'
import { EventCard } from '../Event'
import './Events.css'
import { NavLink } from 'react-router-dom'
import Scroll from 'react-scroll'
import { getIcon, getShortId } from '../Helper'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'

const ScrollLink = Scroll.Link

const EventsList = ({ courseEvents, isAdmin }) => (
  <div className="events-list" id="containerElement">
    {courseEvents.map(event => (
      <EventCard event={event} isAdmin={isAdmin} detail={false} key={event.id} />
    ))}
  </div>
)

const SubEventList = ({ events }) => (
  <div className="subevents-container">
    {events &&
      events.map(subEvent => (
        <div className="subevents-row-container" key={subEvent.id}>
          <div className="subevents-left-container">
            {getIcon(subEvent.type)}
            <NavLink
              to={redirect(ROUTES.EVENT_ID, [
                {
                  key: 'course_id',
                  value: getShortId(subEvent.courseInstance),
                },
                { key: 'event_id', value: subEvent.id },
              ])}
            >
              <span className="subevent-name">{subEvent.name}</span>
            </NavLink>
          </div>
          <div className="subevents-right-container">
            {subEvent.displayDateTime}
          </div>
        </div>
      ))}
  </div>
)

const BlockMenu = ({ courseEvents }) => (
  <ListGroup className="block-menu">
    <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
    {courseEvents.map(event => (
      <ListGroupItem key={event.id} className="block-menu-item">
        <ScrollLink
          to={`${event.id}`}
          spy
          smooth
          duration={500}
          containerId="containerElement"
          className="scrolllink-item"
          activeClass="active-scrolllink-item"
        >
          {event.name}
        </ScrollLink>
      </ListGroupItem>
    ))}
  </ListGroup>
)

export default EventsList

export { BlockMenu, SubEventList }

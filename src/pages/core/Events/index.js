import React from 'react'
import { DropdownItem, DropdownMenu, DropdownToggle, ListGroup, ListGroupItem, UncontrolledDropdown, } from 'reactstrap'
import { EventCard } from '../Event'
import './Events.css'
import { NavLink } from 'react-router-dom'
import Scroll from 'react-scroll'
import { getIcon, getShortId } from '../Helper'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'

const ScrollLink = Scroll.Link
const ScrollLink2 = Scroll.Link

const EventsList = ({courseEvents, isAdmin}) => (
  <div className="events-list" id="containerElement">
    { courseEvents.map(event => (
      <EventCard
        event={ event }
        isAdmin={ isAdmin }
        detail={ false }
        key={ event.id }
      />
    )) }
  </div>
)

const SubEventList = ({events}) => (
  <div className="subevents-container">
    { events &&
      events.map(subEvent => (
        <div className="subevents-row-container" key={ subEvent.id }>
          <div className="subevents-left-container">
            { getIcon(subEvent.type) }
            <NavLink
              to={ redirect(ROUTES.EVENT_ID, [
                {
                  key: 'course_id',
                  value: getShortId(subEvent.courseInstance),
                },
                {key: 'event_id', value: subEvent.id},
              ]) }
            >
              <span className="subevent-name">{ subEvent.name }</span>
            </NavLink>
          </div>
          <div className="subevents-right-container">
            { subEvent.displayDateTime }
          </div>
        </div>
      )) }
  </div>
)

const BlockMenu = ({courseEvents}) => (
  <ListGroup className="block-menu block-menu-non-toggle">
    <ListGroupItem className="timeline">Timeline</ListGroupItem>
    { courseEvents.map(event => (
      <ListGroupItem key={ event.id } className="block-menu-item">
        <ScrollLink
          to={ `${ event.id }` }
          spy
          smooth
          duration={ 500 }
          containerId="containerElement"
          className="scrolllink-item"
          activeClass="active-scrolllink-item"
        >
          { event.name }
        </ScrollLink>
      </ListGroupItem>
    )) }
  </ListGroup>
)

export const BlockMenuToggle = ({
                                  courseEvents,
                                  onClick,
                                  activeEvent,
                                  scroll,
                                }) => (
  <UncontrolledDropdown className="block-menu block-menu-toggle">
    <DropdownToggle nav caret className="timeline timeline-toggler">
      Timeline
    </DropdownToggle>
    <DropdownMenu className="block-menu-dropdown">
      { courseEvents.map(event => (
        <DropdownItem
          id={ event.id }
          key={ event.id }
          className={
            activeEvent && event.id === activeEvent.id
              ? 'block-menu-item block-menu-item-active'
              : 'block-menu-item'
          }
          onClick={ onClick ? e => onClick(e.target.id) : null }
        >
          { scroll ? (
            <ScrollLink2
              to={ `${ event.id }` }
              spy
              smooth
              duration={ 500 }
              containerId="containerElement"
              className="scrolllink-item-toggle"
            >
              { event.name }
            </ScrollLink2>
          ) : (
            <>{ event.name }</>
          ) }
        </DropdownItem>
      )) }
      { courseEvents.length === 0 && (
        <DropdownItem className="block-menu-item">
          No blocks in timeline
        </DropdownItem>
      ) }
    </DropdownMenu>
  </UncontrolledDropdown>
)

export default EventsList

export { BlockMenu, SubEventList }

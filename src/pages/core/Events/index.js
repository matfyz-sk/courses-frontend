import React from "react";

import {
    Container, Row, Col,
    Card, CardSubtitle, CardHeader, CardBody, CardText,
    ListGroup, ListGroupItem, Button,
} from 'reactstrap';
import { FaChalkboardTeacher, FaLaptopCode, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';
import './Events.css';
import {Link} from "react-router-dom";
import Scroll from 'react-scroll';

const ScrollLink = Scroll.Link;

const EventsList = ({ courseEvents, isAdmin }) => (
    <div className="events-list" id="containerElement" >
        {courseEvents.map(event => (
            <Card id={event.id+''} name={event.id+''} key={event.id} className="event-card" >
                <CardHeader className="event-card-header">
                    {event.name}
                    {isAdmin &&
                    <Link to={'/editevent/' + event.id}>
                        <Button className='edit-button'> Edit</Button>
                    </Link>}
                </CardHeader>
                <CardBody>
                <CardText className="event-card-text">{event.description}</CardText>
                <div>
                  <strong> Start:</strong> {new Date(event.startDate).toLocaleString()}
                  <br/>
                  <strong> End:</strong> {new Date(event.endDate).toLocaleString()}
                  <br/>
                    {event.location && <span><strong> Location:</strong> {event.location}</span>}
                </div>
                {event.type==='Block' &&
                    <Container className="sessions-tasks-container">
                        <Row>
                            <Col className='subevents-col-left'>
                                <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
                                <SubEventList events={event.sessions}/>
                            </Col>
                            <Col className='subevents-col-right'>
                                <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
                                <SubEventList events={event.tasks}/>
                            </Col>
                        </Row>
                    </Container>
                }
                </CardBody>
            </Card>
        ))}
    </div>
);

const SubEventList = ({events}) => (
    <div className="subevents-container">
        {events && events.map(subEvent => (
            <div className='subevents-row-container' key={subEvent.id}>
                <div className='subevents-left-container'>
                    {/*TODO different icons*/}
                    {subEvent.type==="Task" ?
                    <FaCalendarCheck  className="icon"/> :
                    <FaClipboardList  className="icon"/>
                    }
                    <Link to={'/event/' + subEvent.id}>
                        <span className="subevent-name">{subEvent.name}</span>
                    </Link>
                </div>
                <div  className='subevents-right-container'>{subEvent.displayDateTime}</div>
            </div>
        ))}
    </div>
);

const BlockMenu = ({courseEvents}) =>  (
    <ListGroup className="block-menu">
        <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
        {courseEvents.map(event => (
            <ListGroupItem key={event.id} className="block-menu-item">
                <ScrollLink
                    to={event.id+''}
                    spy={true}
                    smooth={true}
                    duration={500}
                    containerId="containerElement"
                    className='scrolllink-item'
                    activeClass='active-scrolllink-item'
                >
                {event.name}
                </ScrollLink>
            </ListGroupItem>
        ))}
    </ListGroup>
);

export default EventsList;

export { BlockMenu, SubEventList };
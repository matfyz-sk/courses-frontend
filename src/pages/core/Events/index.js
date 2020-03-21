import React from "react";

import {
    Container, Row, Col,
    Card, CardSubtitle, CardHeader, CardBody, CardText,
    ListGroup, ListGroupItem,
} from 'reactstrap';
import { FaChalkboardTeacher, FaLaptopCode, FaCalendarCheck, FaClipboardList } from 'react-icons/fa';
import './Events.css';

const EventsList = ({ courseEvents }) => (
    <div className="events-list">
        {courseEvents.map(event => (
            <Card className="event-card">
                <CardHeader className="event-card-header">{event.name}</CardHeader>
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
                    <Container>
                        <Row>
                            <Col>
                                <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
                                <Container>
                                    {event.sessions && event.sessions.map(session => (
                                        <Row>
                                            <Col>{session.type==="Lecture" ?
                                                <FaChalkboardTeacher  className="icon"/> :
                                                <FaLaptopCode  className="icon"/>}
                                                <span className="subevent-name">{session.name}</span>
                                            </Col>
                                            <Col>{new Date(session.startDate).toLocaleString()}</Col>
                                        </Row>
                                    ))}
                                </Container>
                            </Col>
                            <Col>
                                <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
                                <Container>
                                    {event.tasks && event.tasks.map(task => (
                                        <Row>
                                            <Col>{task.type==="Task" ?
                                                <FaCalendarCheck  className="icon"/> :
                                                <FaClipboardList  className="icon"/>}
                                                <span className="subevent-name">{task.name}</span>
                                            </Col>
                                            <Col>{new Date(task.startDate).toDateString()}</Col>
                                        </Row>
                                    ))}
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                }
                </CardBody>
            </Card>
        ))}
    </div>
);

const BlockMenu = ({ courseEvents }) =>  (
    <ListGroup className="block-menu">
        <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
        {courseEvents.map(event => (
            <ListGroupItem key={event.id} className="block-menu-item">
                {event.name}
            </ListGroupItem>
        ))}
    </ListGroup>
);

export default EventsList;

export { BlockMenu };
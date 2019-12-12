import React from "react";
import { ListGroup, ListGroupItem } from 'reactstrap';
import './Events.css';
import { Container, Row, Col } from 'reactstrap';
import Moment from 'moment';

const EventsList = ({ courseEvents }) => {
    courseEvents.sort((e1, e2) => {
        var dateA = new Date(Moment(e1.dateTime, "DD/MM/YYYY HH:mm"));
        var dateB = new Date(Moment(e2.dateTime, "DD/MM/YYYY HH:mm"));
        return dateA > dateB ? 1 : -1;
    });
    return (
    <ListGroup>
        {courseEvents.filter(event => { return event.type === "Block"; }).map(event => (
            <ListGroupItem key={event.eid}  className="block-item">
                <h2 className="name">{event.name}</h2>
                <p className="about">{event.about}</p>
                <span>
                  <strong> Date and time:</strong> {event.dateTime}
                </span>

                <Container>
                    <Row>
                        <Col>
                            <ListGroup className="sessions">
                                <h3>Sessions</h3>
                                {courseEvents.filter(e => {
                                    return e.type === "Session" &&
                                        new Date(Moment(e.dateTime, "DD/MM/YYYY HH:mm")) > new Date(Moment(event.dateTime, "DD/MM/YYYY HH:mm"))&&
                                        new Date(Moment(e.dateTime, "DD/MM/YYYY HH:mm")) < new Date(Moment(event.toDateTime, "DD/MM/YYYY HH:mm"));
                                }).map(event => (
                                    <ListGroupItem key={event.eid} className="subevents-item">
                                        <span>{event.name}</span>
                                    </ListGroupItem>
                                    ))}
                            </ListGroup>
                        </Col>
                        <Col>
                            <ListGroup className="tasks">
                                <h3>Tasks</h3>
                                {courseEvents.filter(e => {
                                    return e.type === "Task" &&
                                        new Date(Moment(e.dateTime, "DD/MM/YYYY HH:mm")) > new Date(Moment(event.dateTime, "DD/MM/YYYY HH:mm"))&&
                                        new Date(Moment(e.dateTime, "DD/MM/YYYY HH:mm")) < new Date(Moment(event.toDateTime, "DD/MM/YYYY HH:mm"));
                                }).map(event => (
                                    <ListGroupItem key={event.eid} className="subevents-item">
                                        <span>{event.name}</span>
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>

            </ListGroupItem>
        ))}
    </ListGroup>
)};

const BlockMenu = ({ courseEvents }) => {
    courseEvents.sort((e1, e2) => {
        var dateA = new Date(Moment(e1.dateTime, "DD/MM/YYYY HH:mm"));
        var dateB = new Date(Moment(e2.dateTime, "DD/MM/YYYY HH:mm"));
        return dateA > dateB ? 1 : -1;
    });
    return (
    <ListGroup className="block-menu">
        <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
        {courseEvents.filter(event => { return event.type === "Block"; }).map(event => (
            <ListGroupItem key={event.eid} className="block-menu-item">
                {event.name}
            </ListGroupItem>
        ))}
    </ListGroup>
    );
};

export default EventsList;

export { BlockMenu };
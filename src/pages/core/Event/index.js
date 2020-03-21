import React from "react";
import { NavigationCourse } from "../../../components/Navigation";

import {
    Container, Row, Col,
    Card, CardSubtitle, CardHeader, CardBody, CardText,
    ListGroup, ListGroupItem,
} from 'reactstrap';
import './Event.css';
import { FaRegFile } from 'react-icons/fa';
import NextCalendar from "../NextCalendar";


class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: {
                name: 'The Rabbit Sends in a Little Bill',
                description: 'A certain king had a beautiful garden, and in the garden stood a ' +
                    'tree which bore golden apples. These apples were always counted, and about ' +
                    'the time when they began to grow ripe it was found that every night one of ' +
                    'them was gone. The king became very angry at this, and ordered the gardener ' +
                    'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
                    'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
                    'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
                materials: ['How Dorothy Saved the Scarecrow', 'The Council with the Munchkins']
            }
        }
    }

    componentDidMount() {
        // const { match: { params } } = this.props;

    }

    render() {
        const {event} = this.state;
        return (
            <div>
                <NavigationCourse/>
                <Container>
                    <Row>
                        <Col xs="3">
                            <NextCalendar/>
                        </Col>
                        <Col auto>
                            <Card>
                                <CardHeader className="event-card-header">{event.name}</CardHeader>
                                <CardBody>
                                    <CardText className="event-card-text">{event.description}</CardText>
                                    <CardSubtitle className="event-card-subtitle">Materials</CardSubtitle>
                                    <ListGroup key={event.id}>
                                        { event.materials.map(material => (
                                            <ListGroupItem className="event-list-group-item">
                                                <FaRegFile className="icon"/>
                                                <div className="material-name">
                                                    {material}
                                                </div>
                                            </ListGroupItem>
                                        ))}
                                    </ListGroup>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Event;
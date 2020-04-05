import React from "react";
import { NavigationCourse } from "../../../components/Navigation";

import { Container, Row, Col, Card, CardSubtitle, CardHeader, CardBody, CardText,
        ListGroup, ListGroupItem, Button, Table } from 'reactstrap';
import './Event.css';
import NextCalendar from "../NextCalendar";
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";
import {NavLink} from "react-router-dom";
import {SubEventList} from "../Events";
import {getDisplayDateTime, getIcon} from "../Helper";

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: {
                id: 2,
                name: 'The Rabbit Sends in a Little Bill',
                startDate: '2020-02-18T09:00+01:00',
                endDate: '2020-02-18T13:00+01:00',
                description: 'A certain king had a beautiful garden, and in the garden stood a ' +
                    'tree which bore golden apples. These apples were always counted, and about ' +
                    'the time when they began to grow ripe it was found that every night one of ' +
                    'them was gone. The king became very angry at this, and ordered the gardener ' +
                    'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
                    'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
                    'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
                materials: [{id: 1, name: 'How Dorothy Saved the Scarecrow'},
                            {id:2, name: 'The Council with the Munchkins'}]
            }
        }
    }

    componentDidMount() {
        // const { match: { params } } = this.props;
    }

    render() {
        const {event } = this.state;
        return (
            <div>
                <NavigationCourse/>
                <Container>
                    {/*// className="core-container">*/}
                    {/*<Row>*/}
                    {/*    <Col xs="3">*/}
                    {/*        <NextCalendar/>*/}
                    {/*    </Col>*/}
                    {/*    <Col>*/}
                            <EventCard event={event} isAdmin={this.props.isAdmin}/>
                    {/*    </Col>*/}
                    {/*</Row>*/}
                </Container>
            </div>
        )
    }
}

const EventCard = ({ event, isAdmin }) => (
    <Card id={event.id+''} name={event.id+''} className="event-card" >
        <CardHeader className="event-card-header">
            <NavLink to={'/event/' + event.id} className="subevent-name">
                {event.name}
            </NavLink>
            {isAdmin &&
            <NavLink to={'/editevent/' + event.id}>
                <Button className='edit-button'> Edit</Button>
            </NavLink>
            }
        </CardHeader>
        <CardBody>
            <CardText className="event-card-text">{event.description}</CardText>
            <Table borderless className="event-table">
                <tbody>
                <tr>
                    <th>Start</th><td>{getDisplayDateTime(event.startDate, true)}</td>
                    <th>End</th><td>{getDisplayDateTime(event.endDate, true)}</td>
                </tr>
                {/*{event.location &&*/}
                {/*<tr>*/}
                {/*    <th>Location</th><td colSpan="3">{event.location}</td>*/}
                {/*</tr>*/}
                {/*}*/}
                </tbody>
            </Table>
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
            {event.materials.length>0 &&
            <React.Fragment>
                <CardSubtitle className="event-card-subtitle">Materials</CardSubtitle>
                <ListGroup key={event.id} >
                    {event.materials.map(material => (
                        <ListGroupItem key={material.id} className="event-list-group-item">
                            {getIcon("Material")}
                            <div className="material-name">
                                {material.name}
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </React.Fragment>
            }
        </CardBody>
    </Card>
);

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Event);

export {EventCard};
import React from "react";
import { NavigationCourse } from "../../../components/Navigation";

import {
    Container, Row, Col,
    Card, CardSubtitle, CardHeader, CardBody, CardText,
    ListGroup, ListGroupItem, Button,
} from 'reactstrap';
import './Event.css';
import { FaRegFile } from 'react-icons/fa';
import NextCalendar from "../NextCalendar";
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";
import {Link} from "react-router-dom";


class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            event: {
                id: 2,
                name: 'The Rabbit Sends in a Little Bill',
                description: 'A certain king had a beautiful garden, and in the garden stood a ' +
                    'tree which bore golden apples. These apples were always counted, and about ' +
                    'the time when they began to grow ripe it was found that every night one of ' +
                    'them was gone. The king became very angry at this, and ordered the gardener ' +
                    'to keep watch all night under the tree. The gardener set his eldest son to watch; ' +
                    'but about twelve o’clock he fell asleep, and in the morning another of the apples ' +
                    'was missing. Then the second son was ordered to watch; and at midnight he too fell asleep.',
                materials: [{id: 1, name: 'How Dorothy Saved the Scarecrow'}, {id:2, name: 'The Council with the Munchkins'}]
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
                <NavigationCourse isAdmin={this.props.isAdmin} course={this.state.courseInstance} setUserAdmin={this.props.setUserAdmin}/>
                <Container>
                    <Row>
                        <Col xs="3">
                            <NextCalendar/>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader className="event-card-header">
                                    {event.name}
                                    {this.props.isAdmin &&
                                    <Link to={'/editevent/' + event.id}>
                                        <Button className='edit-button'> Edit</Button>
                                    </Link>}
                                </CardHeader>
                                <CardBody>
                                    <CardText className="event-card-text">{event.description}</CardText>
                                    <CardSubtitle className="event-card-subtitle">Materials</CardSubtitle>
                                    <ListGroup key={event.id} >
                                        { event.materials.map(material => (
                                            <ListGroupItem key={material.id} className="event-list-group-item">
                                                <FaRegFile className="icon"/>
                                                <div className="material-name">
                                                    {material.name}
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

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

export default connect(mapStateToProps, { setUserAdmin })(Event);

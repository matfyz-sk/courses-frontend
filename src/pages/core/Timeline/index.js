import withAuthorization from "../Session/withAuthorization";
import {Component} from "react";
import React from "react";
import EventsList, {BlockMenu} from "../Events"
import { Container, Row, Col } from 'reactstrap';
import './Timeline.css';
import {NavigationCourse} from "../Navigation";
import ModalCreateEvent from "../ModalCreateEvent";

class Timeline extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            events: [],
            courseInstance: undefined,
            course: "",
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;

        this.props.firebase.courseInstance(params.id)
            .get()
            .then(snapshot => {
                const courseInstance = { ...snapshot.data(), cid: snapshot.id };

                if(courseInstance) {
                    this.setState({
                        courseInstance: courseInstance,
                    });

                    this.props.firebase.course(this.state.courseInstance.instanceOf)
                        .get()
                        .then(snapshot => {
                            const course = snapshot.data();

                            this.setState({
                                course: course,
                            });
                        });

                    this.props.firebase
                        .courseEvents()
                        .where("course", "==", params.id)
                        .get()
                        .then(async  snapshot => {
                            let events = [];

                            snapshot.forEach(doc =>
                                    events.push({...doc.data(), eid: doc.id}),
                            );

                            this.setState({
                                loading: false,
                                events: events,
                            });
                        });
                }
            });
    }

    render() {
        return (
            <div>
                <NavigationCourse authUser={this.props.authUser} course={this.state.courseInstance} />
                <main>
                    {this.state.events.length===0 && !this.state.loading &&
                    <p>Timeline for this course is empty.</p>
                    }
                    {this.state.events.length>0 &&
                    <Container>
                        <Row>
                            <Col xs="auto">
                                <BlockMenu courseEvents={this.state.events}/>
                                {this.state.courseInstance && this.props.authUser.uid===this.state.courseInstance.hasInstructor &&
                                <ModalCreateEvent/>
                                }
                            </Col>
                            <Col>
                                <EventsList courseEvents={this.state.events}/>
                            </Col>
                        </Row>
                    </Container>
                    }
                </main>
            </div>
        );
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Timeline);
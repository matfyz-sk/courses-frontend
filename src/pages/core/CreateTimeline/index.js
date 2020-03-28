import React from "react";
import {
    Button,
    Card, CardBody, CardHeader, CardTitle,
    Container, Row, Col, CardSubtitle, Form
} from "reactstrap";
import {NavigationCourse} from "../../../components/Navigation";
import NewEventForm from "../NewEventForm";
import { BlockMenu, SubEventList } from "../Events";
import ModalCreateEvent from "../ModalCreateEvent";

class CreateTimeline extends React.Component {
    render() {
        return(
            <div>
                <NavigationCourse/>
                <Container className="timeline-container">
                    <Row>
                        <Col xs="3">
                            <BlockMenu courseEvents={[]}/>
                        </Col>
                        <Col>
                            <Card>
                                <CardHeader className="event-card-header">New Event</CardHeader>
                                <CardBody>
                                    <NewEventForm type="Block"/>
                                    <Container className="sessions-tasks-container">
                                        <Row>
                                            <Col className='subevents-col-left'>
                                                <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
                                                <SubEventList events={[]}/>
                                            </Col>
                                            <Col className='subevents-col-right'>
                                                <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
                                                <SubEventList events={[]}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div className="button-container">
                                                    <ModalCreateEvent from={''} to={''}/>
                                                </div>
                                            </Col>
                                            <Col>
                                                <div className="button-container">
                                                    <Button className="new-event-button">Add Task</Button>
                                                </div>
                                            </Col>

                                        </Row>
                                    </Container>
                                    <CardSubtitle className="subevents-title">Materials</CardSubtitle>
                                    <Card body className='materials-card'>
                                        <CardBody> </CardBody>
                                        {/*<ListOfMaterials/>*/}
                                    </Card>
                                    <div className="button-container">
                                        <Button className="new-event-button">Add Material</Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default CreateTimeline;
import React from "react";
import {
    Button,
    Card, CardBody, CardHeader, CardTitle,
    Container, Row, Col, CardSubtitle
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
                <CreateBlockForm/>
            </div>
        )
    }
}


class CreateBlockForm extends React.Component {
    render() {
        return (
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
                                <Container>
                                    <Row>
                                        <Col className='subevents-col'>
                                            <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
                                            <SubEventList events={[]}/>
                                        </Col>
                                        <Col className='subevents-col'>
                                            <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
                                            <SubEventList events={[]}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <ModalCreateEvent from={''} to={''}/>
                                    </Row>
                                </Container>
                                <Card className='materials-card'>
                                    <CardTitle>Materials</CardTitle>
                                    {/*<ListOfMaterials/>*/}
                                    <Button>Add Material</Button>
                                </Card>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default CreateTimeline;
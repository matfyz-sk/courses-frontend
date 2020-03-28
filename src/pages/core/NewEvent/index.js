import React from "react";
import { NavigationCourse } from "../../../components/Navigation";

import {Container, Card, CardHeader, CardBody } from 'reactstrap';
import NewEventForm from "../NewEventForm";


const NewEvent = () => (
    <div>
        <NavigationCourse/>
        <Container>
            <Card>
                <CardHeader className="event-card-header">New Event</CardHeader>
                <CardBody>
                    <NewEventForm typeOfForm='create'/>
                </CardBody>
            </Card>
        </Container>
    </div>
);

export default NewEvent;
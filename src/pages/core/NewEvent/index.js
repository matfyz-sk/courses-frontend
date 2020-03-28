import React from "react";
import { NavigationCourse } from "../../../components/Navigation";

import {Container, Card, CardHeader, CardBody } from 'reactstrap';
import EventForm from "../EventForm";


const NewEvent = () => (
    <div>
        <NavigationCourse/>
        <Container>
            <Card>
                <CardHeader className="event-card-header">New Event</CardHeader>
                <CardBody>
                    <EventForm typeOfForm='Create' type='Block'/>
                </CardBody>
            </Card>
        </Container>
    </div>
);

export default NewEvent;
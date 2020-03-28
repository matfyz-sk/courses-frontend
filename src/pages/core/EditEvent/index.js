import React from "react";
import { NavigationCourse } from "../../../components/Navigation";
import EventForm from '../EventForm';

import {Container, Card, CardHeader, CardBody } from 'reactstrap';

// const INITIAL_STATE = {
//     name: '',
//     description: '',
//     from: new Date(),
//     to: new Date(),
//     place: '',
//     type: '',
// };

const EVENT = {
    name: 'Some Event',
    description: '...here goes description for Some Event',
    startDate: '2020-02-27T15:00+01:00',
    endDate: '2020-02-27T17:00+01:00',
    location: 'Matfyz H6',
    type: 'Lab',
};

class EditEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: EVENT.name,
            description: EVENT.description,
            from: new Date(EVENT.startDate),
            to: new Date(EVENT.endDate),
            place: EVENT.location,
            type: EVENT.type,
            course: 2,
        };
    }

    componentDidMount() {
        // const { match: { params } } = this.props; TODO get Event ID

        //TODO get Event with ID

        this.setState({
            // name: EVENT.name,
            // description: EVENT.description,
            // from: new Date(EVENT.startDate),
            // to: new Date(EVENT.endDate),
            // place: EVENT.location,
            // type: EVENT.type,
            // course: 2,
        });
    }

    render() {
        return (
            <div>
                <NavigationCourse/>
                <Container>
                    <Card>
                        <CardHeader className="event-card-header">Edit Event</CardHeader>
                        <CardBody>
                            <EventForm typeOfForm='Edit' {...this.state}/>
                        </CardBody>
                    </Card>
                </Container>
            </div>
        );
    }
}

export default EditEvent;
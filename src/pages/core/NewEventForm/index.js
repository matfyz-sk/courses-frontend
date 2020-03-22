import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {compose} from "recompose";
import {Button, Form, FormGroup, Label, Input, Container, Row, Col} from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './NewEventForm.css';
// import Moment from 'moment';

const INITIAL_STATE = {
    name: '',
    description: '',
    from: new Date(),
    to: new Date(),
    location: '',
    type: 'Block',
};

class NewEventForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleChangeTo = this.handleChangeTo.bind(this);

    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.setState({
            id: params.id,
            type: this.props.type,
            from: this.props.from,
            to: this.props.to,
        })
    }

    onSubmit = event => {
        // const {
        //     name,
        //     about,
        //     from,
        //     to,
        //     location,
        //     type
        // } = this.state;

        // this.props.firebase.courseEvents()
        //     .add({
        //         name: name,
        //         about: about,
        //         location: location,
        //         type: type,
        //         dateTime: Moment(from).format("DD/MM/YYYY HH:mm").toString(),
        //         toDateTime: Moment(to).format("DD/MM/YYYY HH:mm").toString(),
        //         course: this.state.id,
        //     })
        //     .then(docRef => {
        //         // console.log("Document written with ID: ", docRef.id);
        //         this.setState({ ...INITIAL_STATE });
        //         window.location.reload(true)
        //     })
        //     .catch((error) => {
        //         // console.log("Error getting documents: ", error);
        //         this.setState({ error });
        //     });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChangeFrom(date) {
        this.setState({ from: date });
    }

    handleChangeTo(date) {
        this.setState({ to: date });
    }


    render() {
        const {
            name,
            description,
            from,
            to,
            location,
            type,
        } = this.state;

        const isInvalid =
            name === '' ||
            description === '' ||
            from === null ||
            to === null ||
            location === '';

        return(
            <Form onSubmit={this.onSubmit}>
                <FormGroup className="new-event-formGroup">
                    <Label for="name" className="new-event-label">Name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Name"
                    />
                </FormGroup>
                <FormGroup className="new-event-formGroup">
                    <Label for="type" className="new-event-label">Type</Label>
                    <Input id="type" type="select" name="type" value={type} onChange={this.onChange}>
                        <option value="Lecture">Lecture</option>
                        <option value="Lab">Lab</option>
                        <option value="OralExam">OralExam</option>
                        <option value="TestTake">TestTake</option>
                        <option value="Task">Task</option>
                        <option value="Block">Block</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Container>
                        <Row>
                            <Col>
                                <Label for="from" className="label-dateTime">From</Label>
                                <DatePicker
                                    name="from"
                                    id="from"
                                    selected={this.state.from}
                                    onChange={this.handleChangeFrom}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeCaption="time"
                                />
                            </Col>
                            <Col>
                                <Label for="to" className="label-dateTime">To</Label>
                                <DatePicker
                                    name="to"
                                    id="to"
                                    selected={this.state.to}
                                    onChange={this.handleChangeTo}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    timeCaption="time"
                                />
                            </Col>
                        </Row>
                    </Container>
                </FormGroup>
                <FormGroup className="new-event-formGroup">
                    <Label for="description" className="new-event-label">Description</Label>
                    <Input
                        name="description"
                        id="description"
                        value={description}
                        onChange={this.onChange}
                        type="textarea"
                    />
                </FormGroup>
                <FormGroup className="new-event-formGroup">
                    <Label for="location" className="new-event-label">Location</Label>
                    <Input
                        name="location"
                        id="location"
                        value={location}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Location"
                    />
                </FormGroup>
                <Button disabled={isInvalid} type="submit" className="new-event-button">
                    Create
                </Button>
            </Form>
        )
    }
}

export default compose(withRouter,)(NewEventForm);


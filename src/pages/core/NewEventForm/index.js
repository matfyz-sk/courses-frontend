import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {compose} from "recompose";
import {Button, Form, FormGroup, Label, Input, Container, Row, Col} from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './NewEventFormStyle.css';
// import Moment from 'moment';

const INITIAL_STATE = {
    name: '',
    description: '',
    from: new Date(),
    to: new Date(),
    location: '',
    type: '',
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
            typeOfForm: this.props.typeOfForm,
            typeOfEvent: this.props.typeOfEvent,
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

        if (this.state.typeOfForm === 'create') {
            //TODO create new event
        } else {
            //TODO update existing event
        }

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
                    />
                </FormGroup>
                <FormGroup className="new-event-formGroup">
                    <Label for="type" className="new-event-label">Type</Label>
                    <Input id="type" type="select" name="type" value={type} onChange={this.onChange}>
                        <option value="Lecture">Lecture</option>
                        <option value="Lab">Lab</option>
                        <option value="Block">Block</option>
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Container className="event-form-dateTime-container">
                        <Row>
                            <Col className="event-form-dateTime-col">
                                <Label id="from-label" for="from" className="label-dateTime">From</Label>
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
                            <Col className="event-form-dateTime-col">
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
                    />
                </FormGroup>
                <div className="button-container">
                    <Button  className="new-event-button" disabled={isInvalid} type="submit">
                        Create
                    </Button>
                </div>
            </Form>
        )
    }
}

export default compose(withRouter,)(NewEventForm);


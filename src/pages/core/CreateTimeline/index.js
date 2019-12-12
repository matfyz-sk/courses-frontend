import React, { Component } from 'react';
import {withFirebase} from "../Firebase";
import { withRouter } from 'react-router-dom';
import {compose} from "recompose";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from 'moment';

const INITIAL_STATE = {
    name: '',
    about: '',
    from: new Date(),
    to: new Date(),
    location: '',
    type: 'session',
};

class CreateEventForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
        this.handleChangeFrom = this.handleChangeFrom.bind(this);
        this.handleChangeTo = this.handleChangeTo.bind(this);

    }

    componentDidMount() {
        const { match: { params } } = this.props;

        this.setState({
            id: params.id
        })
    }

    onSubmit = event => {
        const {
            name,
            about,
            from,
            to,
            location,
            type
        } = this.state;

        this.props.firebase.courseEvents()
            .add({
                name: name,
                about: about,
                location: location,
                type: type,
                dateTime: Moment(from).format("DD/MM/YYYY HH:mm").toString(),
                toDateTime: Moment(to).format("DD/MM/YYYY HH:mm").toString(),
                course: this.state.id,
            })
            .then(docRef => {
                // console.log("Document written with ID: ", docRef.id);
                this.setState({ ...INITIAL_STATE });
                window.location.reload(true)
            })
            .catch((error) => {
                // console.log("Error getting documents: ", error);
                this.setState({ error });
            });

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
            about,
            from,
            to,
            location,
            type,
        } = this.state;

        const isInvalid =
            name === '' ||
            about === '' ||
            from === null ||
            to === null ||
            location === '';

        return(
            <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Name"
                    />
                    <Label for="about">About</Label>
                    <Input
                        name="about"
                        id="about"
                        value={about}
                        onChange={this.onChange}
                        type="textarea"
                        placeholder="About"
                    />
                    <Label for="location">Location</Label>
                    <Input
                        name="location"
                        id="location"
                        value={location}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Location"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="from">From</Label>
                    <br></br>
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
                    <br></br>
                    <Label for="to">To</Label>
                    <br></br>
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
                    <br></br>
                </FormGroup>
                <FormGroup>
                    <Label for="type">Type</Label>
                    <Input id="type" type="select" name="type" value={type} onChange={this.onChange}>
                        <option value="Session">Session</option>
                        <option value="Task">Task</option>
                        <option value="Block">Block</option>
                    </Input>
                </FormGroup>

                <Button disabled={isInvalid} type="submit">
                    Create
                </Button>
            </Form>
        )
    }
}

const CreateTimelineForm = compose(
    withRouter,
    withFirebase
)(CreateEventForm);

export { CreateTimelineForm };
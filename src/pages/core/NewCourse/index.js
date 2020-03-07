import React, { Component } from 'react';
import Navigation from "../../../components/Navigation";
import {compose} from "recompose";
import {connect} from "react-redux";
import {withAuthorization} from "../../../components/Session";
import store from "../../../redux/store";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

const NewCourse = () => (
    <div>
        <Navigation />
        <main>
            <div>
                <h1>New Course</h1>
                <NewCourseForm/>
            </div>
        </main>
    </div>
);

const INITIAL_STATE = {
    name: '',
    description: '',
    abbreviation: '',
    prerequisites: '',
};

class NewCourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const {
            name,
            description,
            abbreviation,
            prerequisites,
        } = this.state;

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };


    render() {
        const {
            name,
            description,
            abbreviation,
            prerequisites,
        } = this.state;

        const isInvalid =
            name === '' ||
            description === '' ||
            abbreviation === '' ||
            prerequisites === '';
        return (
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
                    <Label for="description">Description</Label>
                    <Input
                        name="description"
                        id="description"
                        value={description}
                        onChange={this.onChange}
                        type="textarea"
                        placeholder="Description"
                    />
                    <Label for="abbreviation">Abbreviation</Label>
                    <Input
                        name="abbreviation"
                        id="abbreviation"
                        value={abbreviation}
                        onChange={this.onChange}
                        type="textarea"
                        placeholder="Abbreviation"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="prerequisites">Prerequisites</Label>
                    <Input
                        name="prerequisites"
                        id="prerequisites"
                        value={prerequisites}
                        onChange={this.onChange}
                        type="textarea"
                        placeholder="Prerequisites"
                    />
                </FormGroup>
                <Button disabled={isInvalid} type="submit">
                    Create
                </Button>
            </Form>
        )
    }
}

const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

// const condition = () => (store.isSignedIn && store.isAdmin);
const condition = () => true;

export default compose(
    connect(mapStateToProps, {}),
    withAuthorization(condition)
)(NewCourse);
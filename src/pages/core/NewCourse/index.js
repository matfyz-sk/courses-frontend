import React, { Component } from 'react';
import Navigation from "../../../components/Navigation";
import {compose} from "recompose";
import {connect} from "react-redux";
// import {withAuthorization} from "../../../components/Session";
// import store from "../../../redux/store";
import {Button, Form, FormGroup, Label, Input, Container, Card, CardHeader, CardBody} from 'reactstrap';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import {Courses} from "../Courses/courses-data.js";
import './NewCourse.css';

const UserOptions = [
    { surname: 'Marmanova', name: 'Patricia' },
    { surname: 'Palko', name: 'Pavol' },
    { surname: 'Mrkvicka', name: 'Jozef' },
    { surname: 'Peterson', name: 'Jordan' },
];

const NewCourse = () => (
    <div>
        <Navigation />
        <Container>
            <Card>
                <CardHeader>New Course</CardHeader>
                <CardBody>
                    <NewCourseForm/>
                </CardBody>
            </Card>
        </Container>
    </div>
);

const INITIAL_STATE = {
    name: '',
    description: '',
    abbreviation: '',
    prerequisites: [],
    admin: [],
};

class NewCourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        // const {
        //     name,
        //     description,
        //     abbreviation,
        //     prerequisites,
        //     admin,
        // } = this.state;

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
            admin,
        } = this.state;

        const isInvalid =
            name === '' ||
            description === '' ||
            abbreviation === '';
        return (
            <Form className="new-course-form" onSubmit={this.onSubmit}>
                <FormGroup className="new-course-inputs">
                    <Label for="name">Name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                    />
                    <Label for="description">Description</Label>
                    <Input
                        name="description"
                        id="description"
                        value={description}
                        onChange={this.onChange}
                        type="textarea"
                    />
                    <Label for="abbreviation">Abbreviation</Label>
                    <Input
                        name="abbreviation"
                        id="abbreviation"
                        value={abbreviation}
                        onChange={this.onChange}
                        type="text"
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="prerequisites">Prerequisites</Label>
                    <Autocomplete
                        multiple
                        name="prerequisites"
                        id="prerequisites"
                        options={Courses}
                        getOptionLabel={option => option.name}
                        defaultValue={prerequisites}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option.name} {...getTagProps({ index })} />
                            ))
                        }
                        style={{ width: 500 }}
                        renderInput={params => (
                            <TextField  {...params} placeholder="" InputProps={{...params.InputProps, disableUnderline: true}}/>
                        )}
                    />

                    <Label for="admin">Admin</Label>
                    <Autocomplete
                        multiple
                        name="admin"
                        id="admin"
                        options={UserOptions}
                        getOptionLabel={option => option.surname}
                        defaultValue={admin}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option.surname} {...getTagProps({ index })}/>
                            ))
                        }
                        style={{ width: 500 }}
                        renderInput={params => (
                            <TextField  {...params} placeholder="" InputProps={{...params.InputProps, disableUnderline: true}}/>
                        )}
                    />
                </FormGroup>
                <Button disabled={isInvalid} type="submit" className="create-button">
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
// const condition = () => true;

export default compose(
    connect(mapStateToProps, {}),
    // withAuthorization(condition)
)(NewCourse);
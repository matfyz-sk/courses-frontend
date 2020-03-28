import React, {Component} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Courses} from "../Courses/courses-data";
// import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import './CourseForm.css';


const INITIAL_STATE = {
    name: '',
    description: '',
    abbreviation: '',
    prerequisites: [],
    admin: [],
};

const UserOptions = [
    { surname: 'Marmanova', name: 'Patricia' },
    { surname: 'Palko', name: 'Pavol' },
    { surname: 'Mrkvicka', name: 'Jozef' },
    { surname: 'Peterson', name: 'Jordan' },
];

class CourseForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };


    }

    componentDidMount() {
        if (this.props.typeOfForm === "Create") {
            this.setState({
                typeOfForm: this.props.typeOfForm
            })
        }
        else if (this.props.typeOfForm === "Edit") {
            this.setState({
                typeOfForm: this.props.typeOfForm,
                name: this.props.name,
                description: this.props.description,
                abbreviation: this.props.abbreviation,
                prerequisites: this.props.prerequisites,
                admin: this.props.admin,
            })
        }
    }

    onSubmit = event => {
        // const {
        //     name,
        //     description,
        //     abbreviation,
        //     prerequisites,
        //     admin,
        // } = this.state;

        // if (this.props.typeOfForm === "Create") {
        // }
        // else if (this.props.typeOfForm === "Edit") {
        // }
        event.preventDefault();
    };

    onChange = event => {
        console.log(event.target.name,': ',event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    };

    onPrerequisitesChange = (event, values) => {
        this.setState({prerequisites: values});
    };

    onAdminChange = (event, values) => {
        this.setState({admin: values});
    };

    render() {
        const {
            name,
            description,
            abbreviation,
            prerequisites,
            admin,
            typeOfForm
        } = this.state;

        const isInvalid =
            name === '' ||
            description === '' ||
            abbreviation === '';
        return (
            <Form className="new-course-form" onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                    />
                    <Label for="abbreviation">Abbreviation</Label>
                    <Input
                        name="abbreviation"
                        id="abbreviation"
                        value={abbreviation}
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
                </FormGroup>
                <FormGroup>
                    <Label for="prerequisites">Prerequisites</Label>
                    <Autocomplete
                        multiple
                        name="prerequisites"
                        id="prerequisites"
                        options={Courses}
                        getOptionLabel={option => option.name}
                        value={prerequisites}
                        onChange={this.onPrerequisitesChange}
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
                        onChange={this.onAdminChange}
                        filterSelectedOptions
                        value={admin}
                        // renderTags={(value, getTagProps) =>
                        //     value.map((option, index) => (
                        //         <Chip label={option.surname} {...getTagProps({ index })}/>
                        //     ))
                        // }
                        style={{ width: 500 }}
                        renderInput={params => (
                            <TextField  {...params}
                                        placeholder=""
                                        InputProps={{...params.InputProps, disableUnderline: true}}/>
                        )}
                    />
                </FormGroup>
                <div className="button-container">
                    <Button disabled={isInvalid} type="submit" className="create-button">
                        {typeOfForm}
                    </Button>
                </div>
            </Form>
        )
    }
}

export default CourseForm;

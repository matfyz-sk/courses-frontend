import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import './AddInstructorModal.css';

const UserOptions = [
    { surname: 'Marmanova', name: 'Patricia' },
    { surname: 'Palko', name: 'Pavol' },
    { surname: 'Mrkvicka', name: 'Jozef' },
    { surname: 'Peterson', name: 'Jordan' },
];

class AddInstructorModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    render() {
        return (
            <div>
                <Button onClick={this.toggle} className="add-instructor-button">+ Add Instructor</Button>
                <Modal  backdrop={true} fade={false} isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Instructor to {this.props.courseName}</ModalHeader>
                    <ModalBody>
                        <AddInstructorForm/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

class AddInstructorForm extends Component {
    constructor(props) {
        super(props);
        this.state = { instructor: "" };
    }

    onSubmit = event => {
        event.preventDefault();
    };

    render() {
        const instructor = this.state;

        const isInvalid =
            instructor === '';
        return (
            <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="instructor">Instructor</Label>
                    <Autocomplete
                        multiple
                        name="instructor"
                        id="instructor"
                        options={UserOptions}
                        getOptionLabel={option => option.surname}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option.surname} {...getTagProps({ index })}/>
                            ))
                        }
                        style={{ maxWidth: 450 }}
                        renderInput={params => (
                            <TextField  {...params} InputProps={{...params.InputProps, disableUnderline: true}}/>
                        )}
                    />
                </FormGroup>
                <Button disabled={isInvalid} type="submit" className="create-button">Add</Button>
            </Form>
        )
    }
}

export default AddInstructorModal;
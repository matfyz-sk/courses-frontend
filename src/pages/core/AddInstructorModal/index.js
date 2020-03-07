import React, { Component } from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input} from 'reactstrap';
import './ModalCreateEvent.css';

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
                <Button onClick={this.toggle} className="">Add Instructor</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Add Instructor to Course Instance</ModalHeader>
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
    render() {
        return (
            <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="instructor">Instructor</Label>
                    <Input
                        name="instructor"
                        id="instructor"
                        // value={instructor}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Name of the Instructor"
                    />
                </FormGroup>
            </Form>
        )
    }
}

export default AddInstructorModal;
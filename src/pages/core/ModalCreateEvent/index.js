import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NewEventForm from "../EventForm";
import './ModalCreateEvent.css';

class ModalCreateEvent extends React.Component {
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
                <Button onClick={this.toggle} className="new-event-button">New Session</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className + ' new-event-modal'}>
                    <ModalHeader toggle={this.toggle}>New Session</ModalHeader>
                    <ModalBody>
                        <NewEventForm typeOfForm="Create" type="Lecture" from={this.props.from} to={this.props.to}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ModalCreateEvent;
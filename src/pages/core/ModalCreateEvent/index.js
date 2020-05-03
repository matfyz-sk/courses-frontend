import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'

class ModalCreateEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  callback = id => {
    this.setState({
      modal: false,
    })
  }

  render() {
    const { from, to } = this.props

    return (
      <div>
        <Button onClick={this.toggle} className="new-session-button">
          New Session
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>New Session</ModalHeader>
          <ModalBody>
            <EventForm
              typeOfForm="Create"
              {...INITIAL_EVENT_STATE}
              options={['Lab', 'Lecture']}
              callBack={this.callback}
              startDate={from}
              endDate={to}
              from={from}
              to={to}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ModalCreateEvent

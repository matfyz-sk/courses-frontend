import React, { Component } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import './EnrollModal.css'

class EnrollModal extends Component {
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

  render() {
    return (
      <div>
        <Button onClick={this.toggle} className="enroll-button">
          Enroll
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle}>
            {this.props.course.name}
          </ModalHeader>
          <ModalBody>
            <EnrollForm />
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

class EnrollForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      termsAndConditions: false,
    }
  }

  onSubmit = event => {
    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { termsAndConditions } = this.state

    const isInvalid = termsAndConditions === false

    return (
      <Form onSubmit={this.onSubmit} className="enroll-form-modal">
        <FormGroup check>
          <Label for="privacy">
            <Input
              name="privacy"
              id="privacy"
              onChange={this.onChange}
              type="checkbox"
            />{' '}
            I wish to use my nickname in this course.
          </Label>
        </FormGroup>
        <FormGroup check>
          <Label for="termsAndConditions">
            <Input
              name="termsAndConditions"
              id="termsAndConditions"
              onChange={this.onChange}
              type="checkbox"
            />{' '}
            I acknowledge that I have read, and do hereby accept the terms and
            conditions.
          </Label>
        </FormGroup>
        <Button
          disabled={isInvalid}
          type="submit"
          className="enroll-button-modal"
        >
          Enroll
        </Button>
      </Form>
    )
  }
}

export default EnrollModal

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
import {fetchUser, setUserAdmin} from '../../../redux/actions'
import { BASE_URL, TOKEN, USER_URL } from '../constants'
import { axiosRequest } from '../AxiosRequests'
import {compose} from "recompose";
import {connect} from "react-redux";
import {withAuthorization} from "../../../components/Session";

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
    const { course, courseInstance, className } = this.props
    return (
      <div>
        <Button onClick={this.toggle} className="enroll-button">
          Enroll
        </Button>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={className}
        >
          <ModalHeader toggle={this.toggle}>{course.name}</ModalHeader>
          <ModalBody>
            <EnrollFormMapped courseInstance={courseInstance} />
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

  requestEnrollment = () => {
    const { courseInstance } = this.props

    //TODO change to real user
    this.props
      .fetchUser(TOKEN, '5siES')
      .then(() => {
        const { user } = this.props

        user.requested.push(courseInstance.fullId)

        const url = `${BASE_URL + USER_URL}/${user.id}`
        axiosRequest(
          'patch',
          TOKEN,
          JSON.stringify({
            requests: user.requested,
          }),
          url
        )
          .then(response => {
            if (response.status === 200) {
              console.log('Hooray!')
            }
          })
          .catch(error => console.log(error))
      })
      .catch(error => console.log(error))
  }

  onSubmit = event => {
    this.requestEnrollment()
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
const mapStateToProps = ({ userReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    user: userReducer.user,
  }
}

const EnrollFormMapped = compose(
  connect(mapStateToProps, { setUserAdmin, fetchUser }),
)(EnrollForm)

export default EnrollModal

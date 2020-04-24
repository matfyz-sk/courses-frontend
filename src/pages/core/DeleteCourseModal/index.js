import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
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
import { BASE_URL, COURSE_INSTANCE_URL, COURSE_URL, TOKEN } from '../constants'
import { axiosRequest } from '../AxiosRequests'
import './DeleteCourseModal.css'

class DeleteCourseModal extends Component {
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
    const { course, courseInstance, type, className, small } = this.props
    return (
      <div>
        <Button onClick={this.toggle} className={`delete-button ${small}`}>
          Delete
        </Button>
        {/*<span onClick={this.toggle} className="edit-delete-buttons">*/}
        {/*  Delete*/}
        {/*</span>*/}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={className}
        >
          <ModalHeader toggle={this.toggle}>{course.name}</ModalHeader>
          <ModalBody>
            <DeleteForm
              course={course}
              courseInstance={courseInstance}
              type={type}
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

class DeleteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      agreeWithDelete: false,
      redirect: null,
    }
  }

  deleteCourse = () => {
    const { course, courseInstance, type } = this.props

    const url = `${
      BASE_URL + (type === 'course' ? COURSE_URL : COURSE_INSTANCE_URL)
    }/${type === 'course' ? course.id : courseInstance.id}`
    axiosRequest('delete', TOKEN, null, url)
      .then(response => {
        if (response && response.status === 200) {
          this.setState({
            redirect: `/courses`,
          })
        }
      })
      .catch(error => console.log(error))
  }

  onSubmit = event => {
    this.deleteCourse()
    event.preventDefault()
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { agreeWithDelete, redirect } = this.state
    const { course } = this.props

    const isInvalid = agreeWithDelete === false

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Form onSubmit={this.onSubmit} className="enroll-form-modal">
        <FormGroup check>
          <Label for="agreeWithDelete">
            <Input
              name="agreeWithDelete"
              id="agreeWithDelete"
              onChange={this.onChange}
              type="checkbox"
            />{' '}
            I am sure I want to delete {course.name}.
          </Label>
        </FormGroup>
        <Button
          disabled={isInvalid}
          type="submit"
          className="enroll-button-modal"
        >
          Delete
        </Button>
      </Form>
    )
  }
}

export default DeleteCourseModal

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { BASE_URL, COURSE_INSTANCE_URL, COURSE_URL } from '../constants'
import { axiosRequest } from '../AxiosRequests'
import './DeleteCourseModal.css'

class DeleteCourseModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      redirect: null,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }))
  }

  callback = () => {
    this.setState({
      redirect: '/courses',
    })
    window.location.reload();
  }

  render() {
    const {course, courseInstance, type, className, small} = this.props
    const {redirect} = this.state

    if(redirect) {
      return <Redirect to={ redirect }/>
    }

    return (
      <div>
        <Button onClick={ this.toggle } className={ `delete-button ${ small }` }>
          Delete
        </Button>
        {/*<span onClick={this.toggle} className="edit-delete-buttons">*/ }
        {/*  Delete*/ }
        {/*</span>*/ }
        <Modal
          isOpen={ this.state.modal }
          toggle={ this.toggle }
          className={ className }
        >
          <ModalHeader toggle={ this.toggle }>{ course.name }</ModalHeader>
          <ModalBody>
            <DeleteForm
              course={ course }
              courseInstance={ courseInstance }
              type={ type }
              callback={ this.callback }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={ this.toggle }>
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
      errors: [],
    }
  }

  deleteCourse = () => {
    const {course, courseInstance, type, callback} = this.props

    const url = `${
      BASE_URL + (type === 'course' ? COURSE_URL : COURSE_INSTANCE_URL)
    }/${ type === 'course' ? course.id : courseInstance.id }`
    axiosRequest('delete', null, url).then(response => {
      if(response && response.status === 200) {
        callback()
      } else {
        const errors = []
        errors.push('There was a problem with server. Try again later.')
        this.setState({
          errors,
        })
      }
    })
  }

  onSubmit = event => {
    const {agreeWithDelete} = this.state

    const errors = this.validate(agreeWithDelete)
    if(errors.length > 0) {
      this.setState({errors})
      event.preventDefault()
      return
    }

    this.deleteCourse()
    event.preventDefault()
  }

  validate = agreeWithDelete => {
    const errors = []
    if(!agreeWithDelete) {
      errors.push('You must be sure to delete course.')
    }
    return errors
  }

  onChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {agreeWithDelete, errors} = this.state
    const {course} = this.props

    const isInvalid = agreeWithDelete === false

    return (
      <>
        { errors.map(error => (
          <p key={ error }>Error: { error }</p>
        )) }
        <Form onSubmit={ this.onSubmit } className="enroll-form-modal">
          <FormGroup check>
            <Label for="agreeWithDelete">
              <Input
                name="agreeWithDelete"
                id="agreeWithDelete"
                onChange={ this.onChange }
                type="checkbox"
              />{ ' ' }
              I am sure I want to delete { course.name }.
            </Label>
          </FormGroup>
          <Button
            disabled={ isInvalid }
            type="submit"
            className="enroll-button-modal"
          >
            Delete
          </Button>
        </Form>
      </>
    )
  }
}

export default DeleteCourseModal

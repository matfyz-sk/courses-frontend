import React, { Component } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import './EnrollModal.css'
import { authHeader, getUser, setUserProfile } from '../../../components/Auth'
import { axiosRequest } from '../AxiosRequests'
import { BASE_URL, USER_URL } from '../constants'
import { Redirect } from 'react-router-dom'
import { BACKEND_URL } from "../../../constants";

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
    const {course, courseInstance, className, user} = this.props
    return (
      <div>
        <Button onClick={ this.toggle } className="enroll-button">
          Enroll
        </Button>
        <Modal
          isOpen={ this.state.modal }
          toggle={ this.toggle }
          className={ className }
        >
          <ModalHeader toggle={ this.toggle }>{ course.name }</ModalHeader>
          <ModalBody>
            <EnrollForm courseInstance={ courseInstance } user={ user }/>
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

class EnrollForm extends Component {
  constructor(props) {
    super(props)
    this.requestPrivacy = this.requestPrivacy.bind(this)
    this.assignPrivacyToCourse = this.assignPrivacyToCourse.bind(this)
    this.state = {
      termsAndConditions: false,
      redirect: null,
      errors: [],
      globalPrivacy: true,
      specificNickname: '',
    }
  }

  requestEnrollment = () => {
    const {user, courseInstance} = this.props

    if(user) {
      const newRequests = user.requests.map(userRequestedCourse => {
        return userRequestedCourse['@id']
      })
      newRequests.push(courseInstance.fullId)

      const url = `${ BASE_URL + USER_URL }/${ user.id }`

      axiosRequest(
        'patch',
        {
          requests: newRequests,
        },
        url
      ).then(response => {
        if(response && response.status === 200) {
          const newRequest = {'@id': courseInstance.fullId}
          user.requests.push(newRequest)
          setUserProfile(user)
          this.setState({
            redirect: `/courses`,
          })
        } else {
          const errors = []
          errors.push(
            'There was a problem with server while sending your request. Try again later.'
          )
          this.setState({
            errors,
          })
        }
      })
    }
  }

  // eslint-disable-next-line react/sort-comp
  assignPrivacyToCourse(iri) {
    const {courseInstance} = this.props
    const personalSettings = []
    for(let i = 0; i < courseInstance.hasPersonalSettings.length; i++) {
      personalSettings.push(courseInstance.hasPersonalSettings[i]['@id'])
    }
    personalSettings.push(iri)

    fetch(`${ BACKEND_URL }data/courseInstance/${ courseInstance.id }`, {
      method: 'PATCH',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({hasPersonalSettings: personalSettings}),
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if(data.status) {
          this.requestEnrollment()
        } else {
          const errors = []
          errors.push(
            'There was a problem with server while sending your request. Try again later.'
          )
          this.setState({
            errors,
          })
        }
      })
  }

  requestPrivacy() {
    const {globalPrivacy, specificNickname} = this.state
    if(!globalPrivacy) {
      const post = {
        hasUser: getUser().fullURI,
        nickName: specificNickname,
      }
      fetch(`${ BACKEND_URL }data/coursePersonalSettings`, {
        method: 'POST',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(post),
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          if(data.status) {
            const {iri} = data.resource
            this.assignPrivacyToCourse(iri)
          } else {
            const errors = []
            errors.push(
              'There was a problem with server while sending your request. Try again later.'
            )
            this.setState({
              errors,
            })
          }
        })
    } else {
      this.requestEnrollment()
    }
  }

  onSubmit = event => {
    const {termsAndConditions, globalPrivacy, specificNickname} = this.state
    event.preventDefault()
    const errors = this.validate(
      termsAndConditions,
      globalPrivacy,
      specificNickname
    )
    if(errors.length > 0) {
      this.setState({errors})
      event.preventDefault()
      return
    }
    this.requestPrivacy()
  }

  validate = (termsAndConditions, globalPrivacy, specificNickname) => {
    const errors = []
    if(!termsAndConditions) {
      errors.push(
        'You must accept the terms and conditions to enroll in course.'
      )
    }
    if(!globalPrivacy && specificNickname.length < 4) {
      errors.push('Specific nickname must cointain at least 4 characters.')
    }
    return errors
  }

  onChange = event => {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    const {
      termsAndConditions,
      redirect,
      errors,
      globalPrivacy,
      specificNickname,
    } = this.state

    const isInvalid = termsAndConditions === false

    if(redirect) {
      return <Redirect to={ redirect }/>
    }

    return (
      <>
        { errors.map(error => (
          <Alert color="danger" key={ error }><b>Error:</b> { error }</Alert>
        )) }
        <Form onSubmit={ this.onSubmit } className="enroll-form-modal">
          <FormGroup check>
            <Label for="useGlobal">
              <Input
                name="useGlobal"
                id="useGlobal"
                checked={ globalPrivacy }
                onChange={ () =>
                  this.setState({globalPrivacy: !globalPrivacy})
                }
                type="checkbox"
              />{ ' ' }
              I wish to use my global privacy settings.
            </Label>
          </FormGroup>
          <FormGroup check>
            <Label for="useSpecific">
              <Input
                name="useSpecific"
                id="useSpecific"
                onChange={ () =>
                  this.setState({globalPrivacy: !globalPrivacy})
                }
                checked={ !globalPrivacy }
                type="checkbox"
              />{ ' ' }
              I wish to use specific nickname in this course.
            </Label>
          </FormGroup>
          { !globalPrivacy ? (
            <FormGroup>
              <Input
                name="specificNickname"
                id="specificNickname"
                placeholder="My specific nickname"
                value={ specificNickname }
                onChange={ e =>
                  this.setState({specificNickname: e.target.value})
                }
                type="text"
              />
            </FormGroup>
          ) : null }
          <FormGroup check>
            <Label for="termsAndConditions">
              <Input
                name="termsAndConditions"
                id="termsAndConditions"
                onChange={ this.onChange }
                type="checkbox"
              />{ ' ' }
              I acknowledge that I have read, and do hereby accept the terms and
              conditions.
            </Label>
          </FormGroup>
          <Button
            disabled={ isInvalid }
            type="submit"
            className="enroll-button-modal"
          >
            Enroll
          </Button>
        </Form>
      </>
    )
  }
}

export default EnrollModal

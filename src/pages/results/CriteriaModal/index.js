import React, { useState } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { authHeader } from '../../../components/Auth'
import { getShortID } from '../../../helperFunctions'
import { store } from '../../../index'
import {
  addCourseInstanceGrading,
  removeCourseInstanceGrading,
  updateCourseInstanceGrading,
} from '../../../redux/actions'
import { BACKEND_URL } from "../../../constants";

const CriteriaModal = props => {
  const {grading, courseInstance} = props
  const [ modal, setModal ] = useState(false)
  const [ form, setForm ] = useState({
    grade: grading ? grading.grade : '',
    minPoints: grading ? grading.minPoints : 0,
  })
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const toggle = () => setModal(!modal)

  function validate() {
    if(form.grade.length === 0) {
      setError('Name of grade is required!')
      setLoading(false)
      return false
    }
    // eslint-disable-next-line no-restricted-globals
    if(isNaN(parseFloat(form.minPoints)) || parseFloat(form.minPoints) < 0) {
      setError('0 is minimal value for points')
      setLoading(false)
      return false
    }
    setLoading(false)
    return true
  }

  function getDetail(id, action = null) {
    fetch(`${ BACKEND_URL }/data/courseGrading/${ id }`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        setLoading(false)
        setError(null)
        if(data['@graph'] && data['@graph'].length > 0) {
          const result = data['@graph'][0]
          switch(action) {
            case 'add':
              store.dispatch(addCourseInstanceGrading(result))
              setError(null)
              setModal(false)
              break
            default:
              break
          }
        } else {
          setError(
            'Error has occured during saving process. Please, try again.'
          )
        }
      })
  }

  function addGradingToCourse(iri) {
    const gradings = []
    for(let i = 0; i < courseInstance.hasGrading.length; i++) {
      gradings.push(courseInstance.hasGrading[i]['@id'])
    }
    gradings.push(iri)

    fetch(
      `${ BACKEND_URL }/data/courseInstance/${ getShortID(courseInstance['@id']) }`,
      {
        method: 'PATCH',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({hasGrading: gradings}),
      }
    )
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if(data.status) {
          getDetail(getShortID(iri), 'add')
        } else {
          setLoading(false)
          setError(
            'Error has occured during saving process. Please, try again.'
          )
        }
      })
  }

  function submitCreate() {
    setLoading(true)
    if(validate()) {
      fetch(`${ BACKEND_URL }/data/courseGrading`, {
        method: 'POST',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(form),
      })
        .then(response => {
          if(!response.ok) throw new Error(response)
          else return response.json()
        })
        .then(data => {
          if(data.status) {
            addGradingToCourse(data.resource.iri)
          } else {
            setLoading(false)
            setError(
              'Error has occured during saving process. Please, try again.'
            )
          }
        })
    }
  }

  function submitUpdate() {
    setLoading(true)
    if(validate()) {
      fetch(`${ BACKEND_URL }/data/courseGrading/${ getShortID(grading['@id']) }`, {
        method: 'PATCH',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(form),
      })
        .then(response => {
          if(!response.ok) throw new Error(response)
          else return response.json()
        })
        .then(data => {
          setLoading(false)
          if(data.status) {
            const newGrading = {
              ...grading,
              ...form,
            }
            store.dispatch(updateCourseInstanceGrading(newGrading))
            setError(null)
            setModal(false)
          } else {
            setError(
              'Error has occured during saving process. Please, try again.'
            )
          }
        })
    }
  }

  function submitDelete() {
    setLoading(true)
    fetch(`${ BACKEND_URL }/data/courseGrading/${ getShortID(grading['@id']) }`, {
      method: 'DELETE',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        setLoading(false)
        if(data.status) {
          store.dispatch(removeCourseInstanceGrading(grading))
          setError(null)
          setModal(false)
        } else {
          setError(
            'Error has occured during removing process. Please, try again.'
          )
        }
      })
  }

  return (
    <>
      <Button
        color={ grading ? 'link' : 'primary' }
        size="sm"
        className={ grading ? 'text-right' : 'float-right mb-3' }
        onClick={ () => toggle() }
      >
        { grading ? 'Detail' : 'New grading' }
      </Button>
      <Modal isOpen={ modal } toggle={ toggle }>
        <ModalHeader toggle={ toggle }>
          { grading
            ? `Change grading ${ grading.grade }?`
            : 'Add grading to course?' }
        </ModalHeader>
        <ModalBody>
          { error !== null ? <Alert color="danger">{ error }</Alert> : null }
          <Form>
            <FormGroup>
              <Label for="grade">Name of grading *</Label>
              <Input
                type="text"
                name="grade"
                id="grade"
                placeholder="e.g. A, B, C, ..."
                value={ form.grade }
                onChange={ e => {
                  setForm({...form, grade: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="minPoints">
                Minimum points to get this grading *
              </Label>
              <Input
                type="number"
                name="minPoints"
                id="minPoints"
                value={ form.minPoints }
                onChange={ e => {
                  setForm({...form, minPoints: e.target.value})
                } }
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={ toggle }>
            Cancel
          </Button>
          { grading ? (
            <Button color="danger" onClick={ submitDelete }>
              Remove
            </Button>
          ) : null }
          <Button
            color="primary"
            onClick={ grading ? submitUpdate : submitCreate }
            disabled={ loading }
          >
            { grading ? 'Update' : 'Create' } grading
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

const mapStateToProps = ({courseInstanceReducer}) => {
  const {courseInstance} = courseInstanceReducer
  return {
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(CriteriaModal))

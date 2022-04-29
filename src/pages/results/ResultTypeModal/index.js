import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { authHeader } from '../../../components/Auth'
import { getShortID } from '../../../helperFunctions'
import { store } from '../../../index'
import {
  addCourseInstanceResultType,
  removeCourseInstanceResultType,
  updateCourseInstanceResultType,
} from '../../../redux/actions'
import { BACKEND_URL } from "../../../constants";

const ResultTypeModal = props => {
  const {resultType, courseInstance} = props
  const [ modal, setModal ] = useState(false)
  const [ form, setForm ] = useState({
    name: resultType ? resultType.name : '',
    minPoints: resultType ? resultType.minPoints : 0,
    description: resultType ? resultType.description : '',
    correctionFor: resultType ? resultType.correctionFor : '',
  })
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const toggle = () => setModal(!modal)

  function validate() {
    if(form.name.length === 0) {
      setError('Name is required!')
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
    fetch(`${ BACKEND_URL }data/resultType/${ id }`, {
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
              store.dispatch(addCourseInstanceResultType(result))
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

  function addResultTypeToCourse(iri) {
    const resultTypes = []
    for(let i = 0; i < courseInstance.hasResultType.length; i++) {
      resultTypes.push(courseInstance.hasResultType[i]['@id'])
    }
    resultTypes.push(iri)

    fetch(
      `${ BACKEND_URL }data/courseInstance/${ getShortID(courseInstance['@id']) }`,
      {
        method: 'PATCH',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({hasResultType: resultTypes}),
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
      if(form.correctionFor === '') {
        delete form.correctionFor
      }
      fetch(`${ BACKEND_URL }data/resultType`, {
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
            addResultTypeToCourse(data.resource.iri)
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
      fetch(`${ BACKEND_URL }data/resultType/${ getShortID(resultType['@id']) }`, {
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
            const newResultType = {
              ...resultType,
              ...form,
            }
            store.dispatch(updateCourseInstanceResultType(newResultType))
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
    fetch(`${ BACKEND_URL }data/resultType/${ getShortID(resultType['@id']) }`, {
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
          store.dispatch(removeCourseInstanceResultType(resultType))
          setError(null)
          setModal(false)
        } else {
          setError(
            'Error has occured during removing process. Please, try again.'
          )
        }
      })
  }

  const options = []
  options.push(
    <option value="" key="empty-select">
      Without correction
    </option>
  )
  if(courseInstance && courseInstance.hasResultType) {
    for(let i = 0; i < courseInstance.hasResultType.length; i++) {
      if(
        !resultType ||
        (resultType &&
          resultType['@id'] !== courseInstance.hasResultType[i]['@id'])
      ) {
        options.push(
          <option
            value={ courseInstance.hasResultType[i]['@id'] }
            key={ courseInstance.hasResultType[i]['@id'] }
          >
            { courseInstance.hasResultType[i].name }
          </option>
        )
      }
    }
  }

  return (
    <>
      <Button
        color={ resultType ? 'link' : 'primary' }
        size="sm"
        className={ resultType ? 'text-right' : 'float-right mb-3' }
        onClick={ () => toggle() }
      >
        { resultType ? 'Detail' : 'New result type' }
      </Button>
      <Modal isOpen={ modal } toggle={ toggle }>
        <ModalHeader toggle={ toggle }>
          { resultType
            ? `Change result type ${ resultType.name }?`
            : 'Add result type to course?' }
        </ModalHeader>
        <ModalBody>
          { error !== null ? <Alert color="danger">{ error }</Alert> : null }
          <Form>
            <FormGroup>
              <Label for="name">Name of result type *</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="e.g. Midterm"
                value={ form.name }
                onChange={ e => {
                  setForm({...form, name: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={ form.description }
                onChange={ e => {
                  setForm({...form, description: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="minPoints">Minimum points to pass</Label>
              <Input
                type="number"
                name="text"
                id="minPoints"
                value={ form.minPoints }
                onChange={ e => {
                  setForm({...form, minPoints: e.target.value})
                } }
              />
            </FormGroup>
            <FormGroup>
              <Label for="resultType">Result type is correction for</Label>
              <Input
                type="select"
                name="correctionFor"
                id="correctionFor"
                value={ form.correctionFor }
                onChange={ e => {
                  setForm({...form, correctionFor: e.target.value})
                } }
              >
                { options }
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={ toggle }>
            Cancel
          </Button>
          { resultType ? (
            <Button color="danger" onClick={ submitDelete }>
              Remove
            </Button>
          ) : null }
          <Button
            color="primary"
            onClick={ resultType ? submitUpdate : submitCreate }
            disabled={ loading }
          >
            { resultType ? 'Update' : 'Create' } result type
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

export default withRouter(connect(mapStateToProps)(ResultTypeModal))

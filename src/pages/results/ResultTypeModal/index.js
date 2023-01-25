import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, } from 'reactstrap'
import { getShortID } from '../../../helperFunctions'
import { store } from '../../../index'
import {
  addCourseInstanceResultType,
  removeCourseInstanceResultType,
  updateCourseInstanceResultType,
} from '../../../redux/actions'
import { 
  useGetResultTypeDetailQuery, 
  useNewResultTypeMutation,
  useUpdateResultTypeMutation,
  useDeleteResultTypeMutation,
} from "services/result"
import { useUpdateCourseInstanceMutation } from "services/course"

function ResultTypeModal(props) {
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
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [newResultType, newResultTypeResult] = useNewResultTypeMutation()
  const [updateResultType, updateResultTypeResult] = useUpdateResultTypeMutation()
  const [deleteResultType, deleteResultTypeResult] = useDeleteResultTypeMutation()
  const toggle = () => setModal(!modal)

  const validate = () => {
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

  const getDetail = (id, action = null) => {
    const {data, isSuccess} = useGetResultTypeDetailQuery(id)
    if (isSuccess) { 
      setLoading(false)
      setError(null)
      if(data && data.length > 0) {
        const result = data[0]
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
    }
  }

  const addResultTypeToCourse = (iri) => {
    const resultTypes = []
    for(let i = 0; i < courseInstance.hasResultType.length; i++) {
      resultTypes.push(courseInstance.hasResultType[i]['@id'])
    }
    resultTypes.push(iri)
    updateCourseInstance({
      id: getShortID(courseInstance['@id']),
      patch: {hasResultType: resultTypes}
    }).unwrap().then(response => {
      if(response.status) {
        getDetail(getShortID(iri), 'add')
      } else {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )
      }
    })
  }

  const submitCreate = () => {
    setLoading(true)
    if(validate()) {
      if(form.correctionFor === '') {
        delete form.correctionFor
      }
      newResultType(form).unwrap().then(response => {
        if(response.status) {
          addResultTypeToCourse(response.resource.iri)
        } else {
          setLoading(false)
          setError(
            'Error has occured during saving process. Please, try again.'
          )
        }
      })
    }
  }

  const submitUpdate = () => {
    setLoading(true)
    if(validate()) {
      updateResultType({
        id: getShortID(resultType['@id']),
        patch: form
      }).unwrap().then(response => {
        setLoading(false)
        if(response.status) {
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

  const submitDelete = () => {
    setLoading(true)
    deleteResultType(getShortID(resultType['@id'])).unwrap().then(response => {
      setLoading(false)
        if(response.status) {
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

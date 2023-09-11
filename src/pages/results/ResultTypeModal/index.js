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
  useLazyGetResultTypeQuery, 
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
  const [getResultType] = useLazyGetResultTypeQuery()
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
    getResultType(id).unwrap().then(data => { 
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
      }
    }).catch(e => {
      setError(
        'Error has occured during saving process. Please, try again.'
      )
    })
  }

  const addResultTypeToCourse = (id) => {
    const resultTypes = []
    for(let i = 0; i < props.resultTypesList.length; i++) {
      resultTypes.push(props.resultTypesList[i]['_id'])
    }
    resultTypes.push(id)
    updateCourseInstance({
      id: courseInstance['_id'],
      body: {hasResultType: resultTypes}
    }).unwrap().then(response => {
      if(response) {
        getDetail(getShortID(id), 'add')
        props.updateResultTypes()
      } else {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )
      }
    })
  }

  const updateResultTypeInCourse = () => {
    const resultTypes = []
    for(let i = 0; i < props.resultTypesList.length; i++) {
      resultTypes.push(props.resultTypesList[i]['_id'])
    }
    updateCourseInstance({
      id: courseInstance['_id'],
      body: {hasResultType: resultTypes}
    }).unwrap().then(response => {
      if(response) {
        props.updateResultTypes()
      } else {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )
      }
    })
  }


  const deleteResultTypeFromCourse = (id) => {
    const resultTypes = []
    for(let i = 0; i < props.resultTypesList.length; i++) {
      if (props.resultTypesList[i]['_id'] != id){
        resultTypes.push(props.resultTypesList[i]['_id'])
      }
    }
    updateCourseInstance({
      id: courseInstance['_id'],
      body: {hasResultType: resultTypes}
    }).unwrap().then(response => {
      if(response) {
        props.updateResultTypes()
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
        if(response) {
          addResultTypeToCourse(response[0]._id)
          setModal(false)
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
        id: resultType['_id'],
        body: form
      }).unwrap().then(response => {
        setLoading(false)
        if(response) {
          const newResultType = {
            ...resultType,
            ...form,
          }
          //store.dispatch(updateCourseInstanceResultType(newResultType))
          setError(null)
          updateResultTypeInCourse()
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
    deleteResultType(resultType._id).unwrap().then(response => {
      setLoading(false)
        if(response){
          store.dispatch(removeCourseInstanceResultType(resultType))
          setError(null)
          setModal(false)
        } else {
          setError(
            'Error has occured during removing process. Please, try again.'
          )
        }
    })
    deleteResultTypeFromCourse(resultType._id)
  }

  const options = []
  options.push(
    <option value={null} key="empty-select">
      Without correction
    </option>
  )
  if(props.resultTypesList) {
    for(let i = 0; i < props.resultTypesList.length; i++) {
      if(
        !resultType ||
        (resultType &&
          resultType['_id'] !== props.resultTypesList[i]['_id'])
      ) {
        options.push(
          <option
            value={ props.resultTypesList[i]['_id'] }
            key={ props.resultTypesList[i]['_id'] }
          >
            { props.resultTypesList[i].name }
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

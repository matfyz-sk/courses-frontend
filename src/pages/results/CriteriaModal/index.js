import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalHeader,
  Button,
  ModalFooter,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getShortID } from '../../../helperFunctions'
import { store } from '../../../index'
import {
  addCourseInstanceGrading,
  removeCourseInstanceGrading,
  updateCourseInstanceGrading,
} from '../../../redux/actions'
import { useUpdateCourseInstanceMutation } from "services/course"
import { 
  useGetCourseGradingQuery,
  useNewCourseGradingMutation,
  useDeleteCourseGradingMutation,
  useUpdateCourseGradingMutation,
} from "services/result"
import { skipToken } from '@reduxjs/toolkit/dist/query'



function CriteriaModal(props) {
  const { grading, courseInstance } = props
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    grade: grading ? grading.grade : '',
    minPoints: grading ? grading.minPoints : 0,
  })
  const [oldForm, setOldForm] = useState({
    grade: grading ? grading.grade : '',
    minPoints: grading ? grading.minPoints : 0,
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(skipToken)
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [newCourseGrading, newCourseGradingResult] = useNewCourseGradingMutation()
  const [deleteCourseGrading, deleteCourseGradingResult] = useDeleteCourseGradingMutation()
  const [updateCourseGrading, updateCourseGradingResult] = useUpdateCourseGradingMutation()
  const {data, isSuccess} = useGetCourseGradingQuery(id)
  const toggle = () => setModal(!modal)

  

  if (isSuccess && id !== skipToken) {
    setLoading(false)
    setError(null)
    if (data && data.length > 0) {
      const result = data[0]
      store.dispatch(addCourseInstanceGrading(result))
      setError(null)
      setModal(false)
    } else {
      setError(
        'Error has occured during saving process. Please, try again.'
      )
    }
  }

  const isGradeValid = (grade, minPoints) => {
    if (grade < 'A' || grade > 'E'){
      setError('You can only create gradings: A, B, C, D or E!')
      setLoading(false)
      return false
    }
    for (let i=0; i<props.list.length; i++){
      if (grade == props.list[i].grade){
        if (oldForm.grade != grade){
          setError('Grade ' + grade + ' already exists!')
        setLoading(false)
        return false
        }
      }
      if (grade < props.list[i].grade && minPoints < props.list[i].minPoints){
        setError('Grade ' + grade + ' cannot have lower min. points than grade ' + props.list[i].grade + '!')
        setLoading(false)
        return false
      }
      if (grade > props.list[i].grade && minPoints > props.list[i].minPoints){
        setError('Grade ' + grade + ' cannot have higher min. points than grade ' + props.list[i].grade + '!')
        setLoading(false)
        return false
      }
      if (minPoints == props.list[i].minPoints){
        setError('Grade ' + grade + ' cannot have the same min. points as grade ' + props.list[i].grade + '!')
        setLoading(false)
        return false
      }
    }
    return true
  }

  

  const validate = () => {
    if (form.grade.length === 0) {
      setError('Name of grade is required!')
      setLoading(false)
      return false
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(parseFloat(form.minPoints)) || parseFloat(form.minPoints) < 0) {
      setError('0 is minimal value for points')
      setLoading(false)
      return false
    }
    if (!isGradeValid(form.grade, form.minPoints)){
      return false
    }
    setLoading(false)
    setOldForm(form)
    return true
  }

  const addGradingToCourse = (id, grade, minPoints) => {
    const gradings = []
    for (let i = 0; i < props.list.length; i++) {
      gradings.push(props.list[i]['_id'])
    }
    gradings.push(id)
    
    updateCourseInstance({
      id: courseInstance['_id'],
      body: { hasGrading: gradings }
    }).unwrap().then(response => {
      
      if (response) {
        props.updateGrading()
      } else {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )
      }
    }).catch(error => {
      console.log(error.message)
    })
  }

  const updateGradingInCourse = (id, grade, minPoints) => {
    const gradings = []
    for (let i = 0; i < props.list.length; i++) {
      gradings.push(props.list[i]['_id'])
    }
    updateCourseInstance({
      id: courseInstance['_id'],
      body: { hasGrading: gradings }
    }).unwrap().then(response => {
      if (response) {
        props.updateGrading()
      } else {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )
      }
    }).catch(error => {
      console.log(error.message)
    })
  }

  const deleteGradingFromCourse = (id) => {
    const gradings = []
    for (let i = 0; i < props.list.length; i++) {
      if (props.list[i]._id != id){
        gradings.push(props.list[i]['_id'])
      }
    }
    updateCourseInstance({
      id: courseInstance['_id'],
      body: { hasGrading: gradings }
    }).unwrap().then(response => {
      if (response) {
        props.updateGrading()
      } else {
        setLoading(false)
        setError(
          'Error has occured during removing process. Please, try again.'
        )
      }
    }).catch(error => {
      console.log(error.message)
    })
  }



  const submitCreate = () => {
    setLoading(true)
    if (validate()) {
      newCourseGrading(form).unwrap().then(response => {
        if (response) {
          addGradingToCourse(response[0]._id, form.grade, form.minPoints);
          setModal(false)
        } else {
          setLoading(false)
          setError(
            'Error has occured during saving process. Please, try again.'
          )
        }
      }).catch(error => {
        console.log(error.message)
      })
    }
  }

  const submitUpdate = () => {
    setLoading(true)
    if (validate()) {
      updateCourseGrading({
        id: grading._id,
        body: form
      }).unwrap().then(response => {
        setLoading(false)
        if (response) {
          let newGrading = {
            ...grading,
            ...form,
          }
          //store.dispatch(updateCourseInstanceGrading(newGrading))
          setError(null)
          setModal(false)
          updateGradingInCourse(form._id, form.grade, form.minPoints)
        } else {
          setError(
            'Error has occured during saving process. Please, try again.'
          )
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const submitDelete = () => {
    setLoading(true)
    deleteCourseGrading(grading._id).unwrap().then(response => {
      setLoading(false)
      if (response) {
        store.dispatch(removeCourseInstanceGrading(grading))
        setError(null)
        setModal(false)
      } else {
        setError(
          'Error has occured during removing process. Please, try again.'
        )
      }
    }).catch(error => {
      console.log(error)
    })
    deleteGradingFromCourse(grading._id)
  }


  

  return (
    
    <>
      <Button
        color={grading ? 'link' : 'primary'}
        size="sm"
        className={grading ? 'text-right' : 'float-right mb-3'}
        onClick={() => toggle()}
      >
        {grading ? 'Detail' : 'New grading'}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {grading
            ? `Change grading ${grading.grade}?`
            : 'Add grading to course?'}
        </ModalHeader>
        <ModalBody>
          {error !== null ? <Alert color="danger">{error}</Alert> : null}
          <Form>
            <FormGroup>
              <Label for="grade">Name of grading *</Label>
              <Input
                type="text"
                name="grade"
                id="grade"
                placeholder="e.g. A, B, C, ..., E"
                value={form.grade}
                onChange={e => {
                  setForm({ ...form, grade: e.target.value })
                }}
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
                value={form.minPoints}
                onChange={e => {
                  setForm({ ...form, minPoints: e.target.value })
                }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" 
          onClick={() => {
              toggle()
              setError(null)
              setLoading(false)
            }}>
            Cancel
          </Button>
          {grading ? (
            <Button color="danger" onClick={submitDelete}>
              Remove
            </Button>
          ) : null}
          <Button
            color="primary"
            onClick={grading ? submitUpdate : submitCreate}
            disabled={loading}
          >
            {grading ? 'Update' : 'Create'} grading
          </Button>
        </ModalFooter>
      </Modal>
      </>
    
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  const { courseInstance } = courseInstanceReducer
  return {
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(CriteriaModal))

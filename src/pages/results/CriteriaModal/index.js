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
    setLoading(false)
    return true
  }

  const addGradingToCourse = (iri) => {
    const gradings = []
    for (let i = 0; i < courseInstance.hasGrading.length; i++) {
      gradings.push(courseInstance.hasGrading[i]['_id'])
    }
    gradings.push(iri)

    updateCourseInstance({
      id: courseInstance['_id'],
      body: { hasGrading: gradings }
    }).unwrap().then(response => {
      if (response.status) {
        setId(getShortID(iri))
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
    if (validate()) {
      newCourseGrading(form).unwrap().then(response => {
        if (response.status) {
          addGradingToCourse(response.resource.iri)
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
    if (validate()) {
      updateCourseGrading({
        id: grading['_id'],
        body: form
      }).unwrap().then(response => {
        setLoading(false)
        if (response.status) {
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

  const submitDelete = () => {
    setLoading(true)
    deleteCourseGrading(grading['_id']).unwrap().then(response => {
      setLoading(false)
      if (response.status) {
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
                placeholder="e.g. A, B, C, ..."
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
          <Button color="secondary" onClick={toggle}>
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

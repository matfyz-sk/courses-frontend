import React, { useState } from 'react'
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
import { 
  useNewCourseGradingMutation,
  useDeleteCourseGradingMutation,
  useUpdateCourseGradingMutation,
  useUpdateCourseInstanceMutation,
} from "services/result"

function CriteriaModal(props) {
  const { grading, courseInstance } = props
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    grade: grading ? grading.grade : '',
    minPoints: grading ? grading.minPoints : 0,
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [newCourseGrading, newCourseGradingResult] = useNewCourseGradingMutation()
  const [deleteCourseGrading, deleteCourseGradingResult] = useDeleteCourseGradingMutation()
  const [updateCourseGrading, updateCourseGradingResult] = useUpdateCourseGradingMutation()
  const toggle = () => setModal(!modal)

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

  const addGradingToCourse = (id) => {
    const gradings = []
    for (let i = 0; i < courseInstance.hasGrading.length; i++) {
      gradings.push(courseInstance.hasGrading[i]['_id'])
    }
    gradings.push(id)

    updateCourseInstance({
      id: courseInstance['_id'],
      body: { hasGrading: gradings }
    }).unwrap().then(response => {
        setLoading(false)
        setModal(false)
    }).catch(error => {
      setLoading(false)
      setError(
        'Error has occured during saving process. Please, try again.'
      )})
  }

  const submitCreate = () => {
    setLoading(true)
    if (validate()) {
      newCourseGrading(form).unwrap().then(response => {
        addGradingToCourse(response[0]._id)
        setLoading(false)
      }).catch(e => {
        setLoading(false)
        setError(
          'Error has occured during saving process. Please, try again.'
        )})
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
        setError(null)
        setModal(false)
      }).catch(e => {
        setLoading(false)
        setError(
            'Error has occured during saving process. Please, try again.'
          )
      })
    }
  }

  const submitDelete = () => {
    setLoading(true)
    deleteCourseGrading(grading['_id']).unwrap().then(response => {
      setLoading(false)
      setError(null)
      setModal(false)
    }).catch(e => {
      setLoading(false)
      setError(
          'Error has occured during saving process. Please, try again.'
      )
      console.log(error)
    })
  }

  return (
    <>
      <Button
        color={grading ? 'link' : 'primary'}
        size="sm"
        className={grading ? 'text-right' : 'float-right mt-1'}
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

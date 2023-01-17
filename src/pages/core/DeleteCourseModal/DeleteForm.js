import React, { useState } from 'react'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import './DeleteCourseModal.css'
import { useDeleteCourseInstanceMutation, useDeleteCourseMutation } from 'services/course'

function DeleteForm(props) {
    const [deleteCourse, deleteCourseResult] = useDeleteCourseMutation()
    const [deleteCourseInstance, deleteCourseInstanceResult] = useDeleteCourseInstanceMutation()
    const [ agreeWithDelete, setAgreeWithDelete ] = useState(false)
    const [ error, setError ] = useState(null)
    const { course, courseInstance, type, callback } = props
   
    const onSubmit = (event) => {      
      if (!agreeWithDelete) {
        setError('You must be sure to delete course.')
        event.preventDefault()
        return
      }
    
      if(type === 'course') {
        deleteCourse(course.id).unwrap().then(response => {
          callback()
        }).catch(error => {
          setError('There was a problem with server. Try again later.')
        })
      } else {
        deleteCourseInstance(courseInstance.id).unwrap().then(response => {
          callback()
        }).catch(error => {
          setError('There was a problem with server. Try again later.')
        })
      }
      event.preventDefault()
    }
    
    const onChange = event => {
      setAgreeWithDelete(event.target.value)
    }

    return (
        <>
          {error ? <p key={error}>Error: {error}</p> : null}
          <Form onSubmit={onSubmit} className="enroll-form-modal">
            <FormGroup check>
              <Label for="agreeWithDelete">
                <Input
                  name="agreeWithDelete"
                  id="agreeWithDelete"
                  onChange={onChange}
                  type="checkbox"
                />{' '}
                I am sure I want to delete {course.name}.
              </Label>
            </FormGroup>
            <Button
              disabled={agreeWithDelete === false}
              type="submit"
              className="enroll-button-modal"
            >
              Delete
            </Button>
          </Form>
        </>
    )
}

export default DeleteForm

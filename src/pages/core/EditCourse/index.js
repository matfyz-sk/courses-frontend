import React, { useState } from 'react'
import {Container, Card, CardHeader, CardBody, Alert} from 'reactstrap'
import CourseForm from '../CourseForm'
import { INITIAL_COURSE_STATE } from '../constants'
import { Redirect } from 'react-router'
import { NOT_FOUND } from '../../../constants/routes'
import { useGetCourseQuery } from 'services/course'

function EditCourse(props) {
  const { match: { params } } = props
  const { data, isSuccess, isLoading } = useGetCourseQuery(params.course_id)
  const [redirectTo, setRedirectTo] = useState(null)

  if (redirectTo) {
    return <Redirect to={redirectTo} />
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let course = INITIAL_COURSE_STATE
  if(isSuccess && data) {
    if(data !== []) {
      course = data.map(courseData => {
        return {
          id: courseData['@id'].substring(courseData['@id'].length - 5),
          name: courseData.name,
          abbreviation: courseData.abbreviation,
          description: courseData.description,
          prerequisites: courseData.hasPrerequisite.map(prerequisite => {
            return { fullId: prerequisite['@id'], name: prerequisite.name }
          }),
          admins: courseData.hasAdmin.map(admin => {
            return {
              fullId: admin['@id'],
              name: `${admin.firstName} ${admin.lastName}`,
            }
          }),
        }
      })[0]
    } else {
      setRedirectTo(NOT_FOUND)
    }
  }

  return (
    <div>
      <Container className="container-view">
        <Card className="event-card">
          <CardHeader className="event-card-header event-card">Edit Course</CardHeader>
          <CardBody className="form-cardbody">
            <CourseForm typeOfForm="Edit" {...course} />
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

export default EditCourse

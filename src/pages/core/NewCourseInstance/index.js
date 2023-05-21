import React, { useState } from 'react'
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'
import { useGetCourseQuery } from 'services/course'
import { getFullID } from 'helperFunctions'

function NewCourseInstance(props) {
  const { match: { params } } = props
  const [redirectTo, setRedirectTo] = useState(null)
  const { data, isSuccess, isLoading } = useGetCourseQuery({id: getFullID(params.course_id, "course")})

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  if (redirectTo) {
    return <Redirect to={redirectTo} />
  }

  let course = null
  if (isSuccess && data) {
    course = data.map(courseData => {
      return {
        fullId: courseData['_id'],
        name: courseData.name ? courseData.name : '',
      }
    })[0]
  } else {
    //setRedirectTo(NOT_FOUND)
  }

  const setRedirect = id => {
    setRedirectTo(`/courses/${id}/event/${id}`)
  }

  return (
    <div>
      <Container>
        <Card className="event-card">
          <CardHeader className="event-card-header">
            New Course Instance for Course
            {course && ` "${course.name}"`}
          </CardHeader>
          <CardBody>
            <EventForm
              typeOfForm="New Course Instance"
              {...INITIAL_EVENT_STATE}
              options={['CourseInstance']}
              callBack={setRedirect}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

export default NewCourseInstance

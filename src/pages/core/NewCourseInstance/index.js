import React, { useState } from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'
import { useGetPlainCourseQuery } from 'services/course'

function NewCourseInstance(props) {
  const { match: { params } } = props
  const [redirectTo, setRedirectTo] = useState(null)
  const { data, isSuccess } = useGetPlainCourseQuery(params.course_id)

  let course = null
  if (isSuccess && data) {
    course = data.map(courseData => {
      return {
        fullId: courseData['@id'],
        name: courseData.name ? courseData.name : '',
      }
    })[0]
  } else {
    setRedirectTo(NOT_FOUND)
  }

  const setRedirect = id => {
    setRedirectTo(`/courses/${id}/event/${id}`)
  }

  if (redirectTo) {
    return <Redirect to={redirectTo} />
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

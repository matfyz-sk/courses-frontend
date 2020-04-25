import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import {
  BASE_URL,
  COURSE_URL,
  INITIAL_EVENT_STATE,
} from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'

class NewCourseInstance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      course: null,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL + COURSE_URL}/${params.course_id}`

    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const course = data.map(courseData => {
          return {
            fullId: courseData['@id'],
            name: courseData.name ? courseData.name : '',
          }
        })[0]
        this.setState({
          course,
        })
      } else {
        // TODO wrong course id
      }
    })
  }

  render() {
    const { course } = this.state

    return (
      <div>
        <Container>
          <Card>
            <CardHeader className="event-card-header">
              New Course Instance for Course
              {course && ` "${course.name}"`}
            </CardHeader>
            <CardBody>
              <EventForm
                typeOfForm="New Course Instance"
                {...INITIAL_EVENT_STATE}
                options={['CourseInstance']}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}
export default NewCourseInstance

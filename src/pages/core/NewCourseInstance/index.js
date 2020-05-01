import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { BASE_URL, COURSE_URL, INITIAL_EVENT_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'

class NewCourseInstance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseId: '',
      course: null,
      redirect: null,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      courseId: params.course_id,
    })

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
        this.setState({
          redirect: NOT_FOUND,
        })
      }
    })
  }

  setRedirect = id => {
    const { courseId } = this.state

    this.setState({
      redirect: `/courses/${courseId}/event/${id}`,
    })
  }

  render() {
    const { course, redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

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
                callBack={this.setRedirect}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}
export default NewCourseInstance

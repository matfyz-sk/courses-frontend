import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import CourseForm from '../CourseForm'
import { BASE_URL, COURSE_URL, INITIAL_COURSE_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { Redirect } from 'react-router'
import { NOT_FOUND } from '../../../constants/routes'

class EditCourse extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: INITIAL_COURSE_STATE,
      redirect: null,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL + COURSE_URL}/${
      params.course_id
    }?_join=hasPrerequisite,hasAdmin`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null && data !== []) {
        const course = data.map(courseData => {
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

  render() {
    const { course, redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div>
        <Container className="event-card-header">
          <Card>
            <CardHeader>Edit Course</CardHeader>
            <CardBody>
              <CourseForm typeOfForm="Edit" {...course} />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default EditCourse

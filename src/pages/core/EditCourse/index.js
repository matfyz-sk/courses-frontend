import React from 'react'
import {Container, Card, CardHeader, CardBody, Alert} from 'reactstrap'
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
      loading: true,
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
      this.setState({
        loading: false,
      })
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
    const { course, redirect, loading } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    if (loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
    }

    return (
      <div>
        <Container className="container-view">
          <Card>
            <CardHeader className="event-card-header">Edit Course</CardHeader>
            <CardBody className="form-cardbody">
              <CourseForm typeOfForm="Edit" {...course} />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default EditCourse

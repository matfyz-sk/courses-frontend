import React from 'react'
import {
  Container,
  Card,
  CardSubtitle,
  CardHeader,
  CardBody,
  CardText,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { BASE_URL, COURSE_URL, INITIAL_COURSE_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import './course.css'
import { Redirect } from 'react-router'
import { NOT_FOUND } from '../../../constants/routes'


class Course extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: INITIAL_COURSE_STATE,
      redirectTo: null,
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
          redirectTo: NOT_FOUND,
        })
      }
    })
  }

  render() {
    const { course, redirectTo } = this.state
    const { user } = this.props

    if (redirectTo) {
      return <Redirect to={redirectTo} />
    }

    const isAdmin = user
      ? course.admins.findIndex(admin => {
          return admin === user.fullURI
        }) > -1
      : false

    return (
      <div>
        <Container>
          {course && (
            <CourseCard
              course={course}
              isAdmin={user ? user.isSuperAdmin || isAdmin : false}
            />
          )}
        </Container>
      </div>
    )
  }
}

const CourseCard = ({ course, isAdmin }) => (
  <Card className="event-card">
    <CardHeader className="course-card-header">
      <span className="course-card-name">{course.name}</span>
      {isAdmin && (
        <NavLink
          to={redirect(ROUTES.EDIT_COURSE_ID, [
            { key: 'course_id', value: course.id },
          ])}
          className="edit-delete-buttons"
        >
          Edit
        </NavLink>
      )}
    </CardHeader>
    <CardBody>
      <strong>Abbreviation:</strong> {course.abbreviation}
      <br />
      <br />
      <CardText className="event-card-text">{course.description}</CardText>
      {course.prerequisites && course.prerequisites.length > 0 && (
        <>
          <CardSubtitle className="event-card-subtitle">
            Prerequisites
          </CardSubtitle>
          <ListGroup key={course.id} className="course-list-group">
            {course.prerequisites.map(prerequisite => (
              <ListGroupItem
                key={prerequisite.id}
                className="course-list-group-item"
              >
                <div className="material-name">{prerequisite.name}</div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      )}
      <br />
      {course.admins && course.admins.length > 0 && (
        <>
          <CardSubtitle className="event-card-subtitle">Admins</CardSubtitle>
          <ListGroup key={course.id} className="course-list-group">
            {course.admins.map(admin => (
              <ListGroupItem key={admin.id} className="course-list-group-item">
                <div className="material-name">{admin.name}</div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      )}
    </CardBody>
  </Card>
)

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(Course)

import React from 'react'
import { Alert, Card, CardBody, CardHeader, CardSubtitle, Container, Table, } from 'reactstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { BASE_URL, COURSE_URL, INITIAL_COURSE_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { NOT_FOUND } from '../../../constants/routes'
import './course.css'
import { Redirect } from 'react-router'

class Course extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      course: INITIAL_COURSE_STATE,
      redirectTo: null,
      loading: true,
    }
  }

  componentDidMount() {
    const {
      match: {params},
    } = this.props

    const url = `${ BASE_URL + COURSE_URL }/${
      params.course_id
    }?_join=hasPrerequisite,hasAdmin`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
      if(data != null && data !== []) {
        const course = data.map(courseData => {
          return {
            id: courseData['@id'].substring(courseData['@id'].length - 5),
            name: courseData.name,
            abbreviation: courseData.abbreviation,
            description: courseData.description,
            prerequisites: courseData.hasPrerequisite.map(prerequisite => {
              return {fullId: prerequisite['@id'], name: prerequisite.name}
            }),
            admins: courseData.hasAdmin.map(admin => {
              return {
                fullId: admin['@id'],
                name: `${ admin.firstName } ${ admin.lastName }`,
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
    const {course, redirectTo, loading} = this.state
    const {user} = this.props

    if(redirectTo) {
      return <Redirect to={ redirectTo }/>
    }

    if(loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
    }

    const isAdmin = user
      ? course.admins
      .map(admin => admin.fullId)
      .findIndex(admin => {
        return admin === user.fullURI
      }) > -1
      : false

    return (
      <div>
        <Container className="container-view">
          { course && (
            <CourseCard
              course={ course }
              isAdmin={ user ? user.isSuperAdmin || isAdmin : false }
            />
          ) }
        </Container>
      </div>
    )
  }
}

const CourseCard = ({course, isAdmin}) => (
  <Card className="event-card">
    <CardHeader className="course-card-header">
      <span className="course-card-name">{ course.name }</span>
      { isAdmin && (
        <NavLink
          to={ redirect(ROUTES.EDIT_COURSE_ID, [
            {key: 'course_id', value: course.id},
          ]) }
          className="edit-delete-buttons"
        >
          Edit
        </NavLink>
      ) }
    </CardHeader>
    <CardBody>
      <CardSubtitle className="event-card-subtitle">Abbreviation</CardSubtitle>
      <div className="fake-table">{ course.abbreviation }</div>

      <CardSubtitle className="event-card-subtitle">Description</CardSubtitle>
      <div className="fake-table">{ course.description }</div>

      { course.prerequisites && course.prerequisites.length > 0 && (
        <>
          <CardSubtitle className="event-card-subtitle">
            Prerequisites
          </CardSubtitle>
          <Table responsive key="prerequisites" className="course-tables">
            <tbody>
            { course.prerequisites.map(prerequisite => (
              <tr key={ `${ prerequisite.id }tr` } className="course-list-group-item">
                <td className="material-name">{ prerequisite.name }</td>
              </tr>
            )) }
            </tbody>
          </Table>
        </>
      ) }
      { course.admins && course.admins.length > 0 && (
        <>
          <CardSubtitle className="event-card-subtitle">Admins</CardSubtitle>
          <Table responsive key="admins" className="course-tables">
            <tbody>
            { course.admins.map(admin => (
              <tr key={ `${ admin.id }tr` } className="course-list-group-item">
                <td className="material-name">
                  { admin.name }
                </td>
              </tr>
            )) }
            </tbody>
          </Table>
        </>
      ) }
    </CardBody>
  </Card>
)

const mapStateToProps = ({authReducer}) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(Course)

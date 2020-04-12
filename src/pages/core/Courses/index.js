import React, { Component } from 'react'
import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  TabContent,
  NavLink as NL,
  TabPane,
  UncontrolledCollapse,
  Button,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withAuthorization } from '../../../components/Session'
import * as ROUTES from '../../../constants/routes'

import './Courses.css'
import Navigation from '../../../components/Navigation'
import EnrollModal from '../EnrollModal'
import AddInstructorModal from '../AddInstructorModal'
import { getIcon } from '../Helper'
import arrow from '../../../images/arrow.svg'

import { setUserAdmin, fetchUser } from '../../../redux/actions'
import { axiosRequest, getData } from '../AxiosRequests'
import { BASE_URL, COURSE_INSTANCE_URL, COURSE_URL, TOKEN } from '../constants'
// import {Enroll} from "../Enrollments";

const THIS_YEAR = '2020'
class CoursesPageBase extends Component {
  constructor(props) {
    super(props)
    this.enroll = this.enroll.bind(this)
    this.toggle = this.toggle.bind(this)
    this.groupCourses = this.groupCourses.bind(this)

    const activeTab = this.props.isSignedIn ? '1' : '2'

    this.state = {
      activeTab,
      activeCourses: [], //ActiveCourses, //not (enrolled || teaching || admin) && this semester
      myActiveCourses: [], //MyActiveCourses, //  (enrolled || teaching || admin) && this semester
      myArchivedCourses: [], //MyArchivedCourses, // (enrolled || teaching || admin) && not this semester
    }
  }

  componentDidMount() {
    const url = `${BASE_URL + COURSE_INSTANCE_URL}?_join=instanceOf`
    axiosRequest('get', TOKEN, null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const courses = data.map(courseInstance => {
          return {
            id: courseInstance['@id'].substring(
              courseInstance['@id'].length - 5
            ),
            fullId: courseInstance['@id'],
            year: courseInstance.year,
            name: courseInstance.instanceOf[0].name,
            abbreviation: courseInstance.instanceOf[0].abbreviation,
            description: courseInstance.instanceOf[0].description,
            courseId: courseInstance.instanceOf[0]['@id'].substring(
              courseInstance.instanceOf[0]['@id'].length - 5
            ),
            startDate: courseInstance.startDate,
            endDate: courseInstance.endDate,
          }
        })

        this.props.fetchUser(TOKEN, 'JzzrB').then(() => {
          const { user } = this.props
          console.log(courses)
          console.log(user)

          for (const course of courses) {
            for (const j in user.enrolled) {
              const course2 = user.enrolled[j]
              course.enrolled = course.fullId === `${course2['@id']}`
            }
            for (const j in user.instructorOf) {
              const course2 = user.instructorOf[j]
              course.instructor = course.fullId === `${course2['@id']}`
            }
            course.admin = user.admin //course.id in user.admin
            // console.log(course)
          }

          let activeCourses = []
          let myActiveCourses = []
          let myArchivedCourses = []

          for (const i in courses) {
            const course = courses[i]
            if (
              course.enrolled === true ||
              course.instructor === true ||
              course.admin === true
            ) {
              if (course.year === THIS_YEAR) {
                myActiveCourses.push(course)
              } else if (course.year < THIS_YEAR) {
                myArchivedCourses.push(course)
              }
            } else if (course.year === THIS_YEAR) {
              activeCourses.push(course)
            }
          }

          activeCourses = this.groupCourses(activeCourses)
          myActiveCourses = this.groupCourses(myActiveCourses)
          myArchivedCourses = this.groupCourses(myArchivedCourses)
          const allCourses = this.groupCourses(this.state.allCourses)

          this.setState({
            activeCourses,
            myActiveCourses,
            myArchivedCourses,
            allCourses,
          })
        })
      }
    })
  }

  groupCourses(courses) {
    const groupedCourses = {}
    for (const i in courses) {
      const course = courses[i]
      if (!(course.courseId in groupedCourses)) {
        groupedCourses[course.courseId] = {
          id: course.courseId,
          name: course.name,
          desc: course.description,
          abbr: course.abbreviation,
          admin: course.admin,
          courses: [],
        }
      }
      groupedCourses[course.courseId].courses.push({
        id: course.id,
        year: course.year,
        enrolled: course.enrolled,
        instructor: course.instructor,
      })
    }
    return Object.keys(groupedCourses).map(function (key) {
      return groupedCourses[key]
    })
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  enroll(course) {}

  render() {
    const {
      myActiveCourses,
      myArchivedCourses,
      activeCourses,
      allCourses,
    } = this.state

    const { courses } = this.props

    return (
      <>
        <Navigation />
        <main className="courses_main">
          <div className="courses">
            <Nav tabs>
              {this.props.isSignedIn && (
                <NavItem>
                  <NL
                    className={classnames({
                      active: this.state.activeTab === '1',
                    })}
                    onClick={() => {
                      this.toggle('1')
                    }}
                  >
                    <span className="tab">My Courses</span>
                  </NL>
                </NavItem>
              )}
              <NavItem>
                <NL
                  className={classnames({
                    active: this.state.activeTab === '2',
                  })}
                  onClick={() => {
                    this.toggle('2')
                  }}
                >
                  <span className="tab">Active Courses</span>
                </NL>
              </NavItem>
              {this.props.isSignedIn && (
                <NavItem>
                  <NL
                    className={classnames({
                      active: this.state.activeTab === '3',
                    })}
                    onClick={() => {
                      this.toggle('3')
                    }}
                  >
                    <span className="tab">Archived Courses</span>
                  </NL>
                </NavItem>
              )}
              {this.props.isSignedIn && this.props.isAdmin && (
                <NavItem>
                  <NL
                    className={classnames({
                      active: this.state.activeTab === '4',
                    })}
                    onClick={() => {
                      this.toggle('4')
                    }}
                  >
                    <span className="tab">ALL Courses</span>
                  </NL>
                </NavItem>
              )}
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              {this.props.isSignedIn && (
                <TabPane tabId="1">
                  <CoursesList
                    coursesList={myActiveCourses}
                    enroll={null}
                    isAdmin={this.props.isAdmin}
                  />
                </TabPane>
              )}
              <TabPane tabId="2">
                <CoursesList
                  coursesList={activeCourses}
                  enroll={this.props.isSignedIn ? this.enroll : null}
                  isAdmin={this.props.isAdmin}
                />
              </TabPane>
              {this.props.isSignedIn && (
                <TabPane tabId="3">
                  <CoursesList
                    coursesList={myArchivedCourses}
                    enroll={null}
                    isAdmin={this.props.isAdmin}
                  />
                </TabPane>
              )}
              {this.props.isAdmin && (
                <TabPane tabId="4">
                  <CoursesList
                    coursesList={courses}
                    enroll={null}
                    isAdmin={this.props.isAdmin}
                  />
                </TabPane>
              )}
            </TabContent>
          </div>
        </main>
      </>
    )
  }
}

const CoursesList = ({ coursesList, enroll, isAdmin }) => (
  <ListGroup>
    {coursesList.length === 0 && (
      <ListGroupItem className="course-container">
        There are no courses in this section.
      </ListGroupItem>
    )}
    {coursesList.map(course => (
      <ListGroupItem className="course-container" key={course.id}>
        {course.courses && course.courses.length === 1 && (
          <div className="single-course-container">
            <NavLink to={ROUTES.TIMELINE + course.courses[0].id}>
              <span className="name">{course.name}</span>
              <br />
              <span className="about">{course.desc}</span>
            </NavLink>

            <div className="courses-right-top-corner-container">
              {course.admin !== false && getIcon('Admin')}
              <RoleIcon course={course.courses[0]} />
              {(isAdmin || course.admin) && (
                <>
                  <AddInstructorModal courseName={course.name} />
                  <NavLink to={`/editcourse/${course.id}`}>
                    <Button className="edit-course-button">Edit</Button>
                  </NavLink>
                </>
              )}
              {enroll != null && <EnrollModal course={course} />}
            </div>
          </div>
        )}
        {course.courses && course.courses.length > 1 && (
          <>
            <div className="multiple-course-container">
              <div>
                <span className="name">{course.name}</span>
                <br />
                <span className="about">{course.desc}</span>
              </div>
              <div className="courses-right-top-corner-container">
                {course.admin !== false && getIcon('Admin')}
                {(isAdmin || course.admin) && (
                  // <AddInstructorModal courseName={course.name} />
                  <NavLink to={`/editcourse/${course.id}`}>
                    <Button className="edit-course-button">Edit</Button>
                  </NavLink>
                )}
              </div>
            </div>
            <CollapsableCourse
              course={course}
              enroll={enroll}
              isAdmin={isAdmin}
              className="collapsable-container"
            />
          </>
        )}
      </ListGroupItem>
    ))}
  </ListGroup>
)

const CollapsableCourse = ({ course, enroll, isAdmin }) => (
  <div>
    <img
      src={arrow}
      alt="arrow"
      className="collapse-arrow"
      id={`toggler${course.id}`}
      width="15px"
    />
    <UncontrolledCollapse toggler={`#toggler${course.id}`}>
      <Card className="course-instances-card">
        <CardBody className="course-instances-card-body">
          {course.courses
            .sort((a, b) => (a.year > b.year ? 1 : -1))
            .map(courseInstance => (
              <ListGroup key={courseInstance.id}>
                <ListGroupItem className="single-course-container">
                  <NavLink to={ROUTES.TIMELINE + courseInstance.id}>
                    <span className="">{course.name}</span>{' '}
                    <b>{courseInstance.year}</b>
                  </NavLink>
                  <div className="courses-right-top-corner-container">
                    <RoleIcon course={courseInstance} />
                    {(isAdmin || course.admin) && (
                      <>
                        <AddInstructorModal courseName={course.name} />
                      </>
                    )}
                    {enroll != null && <EnrollModal course={courseInstance} />}
                  </div>
                </ListGroupItem>
              </ListGroup>
            ))}
        </CardBody>
      </Card>
    </UncontrolledCollapse>
  </div>
)

const RoleIcon = ({ course }) => (
  <div>
    {course.enrolled !== false && getIcon('Student')}
    {course.instructor !== false && getIcon('Teacher')}
  </div>
)

const mapStateToProps = ({ userReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    user: userReducer.user,
  }
}

const condition = () => true

const CoursesPage = compose(
  connect(mapStateToProps, { setUserAdmin, fetchUser }),
  withAuthorization(condition)
)(CoursesPageBase)

export default CoursesPage

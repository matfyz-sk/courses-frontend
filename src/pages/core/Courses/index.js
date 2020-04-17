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
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withAuthorization } from '../../../components/Session'
import * as ROUTES from '../../../constants/routes'

import './Courses.css'
import EnrollModal from '../EnrollModal'
import { getIcon } from '../Helper'
import arrow from '../../../images/arrow.svg'

import { setUserAdmin, fetchUser } from '../../../redux/actions'
import { axiosRequest, getData } from '../AxiosRequests'
import { BASE_URL, COURSE_INSTANCE_URL, TOKEN, USER_URL } from '../constants'
import DeleteCourseModal from '../DeleteCourseModal'
import { redirect } from '../../../constants/redirect'

const THIS_YEAR = '2020'
class CoursesPageBase extends Component {
  constructor(props) {
    super(props)
    const activeTab = this.props.user ? '1' : '2'

    this.state = {
      activeTab,
      activeCourses: [], //ActiveCourses, //not (enrolled || teaching || admin) && this semester
      myActiveCourses: [], //MyActiveCourses, //  (enrolled || teaching || admin) && this semester
      myArchivedCourses: [], //MyArchivedCourses, // (enrolled || teaching || admin) && not this semester
      allCourses: [],
    }
  }

  componentDidMount() {
    const { user } = this.props

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

        if (user != null) {
          for (const course of courses) {
            course.enrolled =
              user.studentOf.findIndex(userEnrolledCourse => {
                return userEnrolledCourse['@id'] === course.fullId
              }) > -1

            course.requests =
              user.requests.findIndex(userRequestedCourse => {
                return userRequestedCourse['@id'] === course.fullId
              }) > -1

            course.instructor =
              user.instructorOf.findIndex(userInstructorCourse => {
                return userInstructorCourse['@id'] === course.fullId
              }) > -1

            // course.admin = false
            //TODO uncomment when implemented
            course.admin =
              course.hasAdmin.findIndex(admin => {
                return admin['@id'] === user.fullId
              }) > -1
          }

          let activeCourses = []
          let myActiveCourses = []
          let myArchivedCourses = []

          for (const course of courses) {
            if (
              course.enrolled === true ||
              course.instructor === true ||
              course.admin === true
            ) {
              if (
                new Date(course.startDate) <= new Date() &&
                new Date(course.endDate) > new Date()
              ) {
                myActiveCourses.push(course)
              } else if (new Date(course.endDate) < new Date()) {
                myArchivedCourses.push(course)
              }
            } else if (
              new Date(course.startDate) <= new Date() &&
              new Date(course.endDate) > new Date()
            ) {
              activeCourses.push(course)
            }
          }

          activeCourses = this.groupCourses(activeCourses)
          myActiveCourses = this.groupCourses(myActiveCourses)
          myArchivedCourses = this.groupCourses(myArchivedCourses)
          const allCourses = this.groupCourses(courses)

          this.setState({
            activeCourses,
            myActiveCourses,
            myArchivedCourses,
            allCourses,
          })
        } else {
          let activeCourses = []
          for (const course of courses) {
            if (
              new Date(course.startDate) <= new Date() &&
              new Date(course.endDate) > new Date()
            ) {
              activeCourses.push(course)
            }
          }
          activeCourses = this.groupCourses(activeCourses)
          this.setState({
            activeCourses,
          })
        }
      }
    })
  }

  groupCourses = courses => {
    const groupedCourses = {}
    for (const course of courses) {
      if (!(course.courseId in groupedCourses)) {
        groupedCourses[course.courseId] = {
          id: course.courseId,
          fullId: course.fullId,
          name: course.name,
          desc: course.description,
          abbr: course.abbreviation,
          admin: course.admin,
          courses: [],
        }
      }
      groupedCourses[course.courseId].courses.push({
        id: course.id,
        fullId: course.fullId,
        year: course.year,
        enrolled: course.enrolled,
        instructor: course.instructor,
        requests: course.requests,
      })
    }
    return Object.keys(groupedCourses).map(function (key) {
      return groupedCourses[key]
    })
  }

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      })
    }
  }

  render() {
    const {
      myActiveCourses,
      myArchivedCourses,
      activeCourses,
      allCourses,
    } = this.state

    const { user } = this.props

    return (
      <main className="courses_main">
        <div className="courses">
          <Nav tabs>
            {user && (
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
            {user && (
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
            {user && user.isSuperadmin && (
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
                enroll={this.props.isSignedIn ? true : null}
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
                  coursesList={allCourses}
                  enroll={null}
                  isAdmin={this.props.isAdmin}
                />
              </TabPane>
            )}
          </TabContent>
        </div>
      </main>
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
        {/* teacher and student only one instance */}
        {course.courses &&
        course.courses.length === 1 &&
        !course.admin &&
        !isAdmin ? (
          <div className="single-course-container">
            <NavLink
              to={redirect(ROUTES.TIMELINE, [
                { key: 'course_id', value: course.courses[0].id },
              ])}
            >
              <span className="name">{course.name}</span>
              <br />
              <span className="about">{course.desc}</span>
            </NavLink>

            <div className="courses-right-top-corner-container">
              <RoleIcon course={course.courses[0]} />
              {enroll != null &&
                (!course.courses[0].requests ? (
                  <EnrollModal
                    course={course}
                    courseInstance={course.courses[0]}
                  />
                ) : (
                  <span className="requested">Requested</span>
                ))}
            </div>
          </div>
        ) : (
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
                  <div>
                    <NavLink
                      className="edit-delete-buttons"
                      to={`/editcourse/${course.id}`}
                    >
                      <span className="edit-delete-buttons">Edit</span>
                    </NavLink>
                    &nbsp;
                    {/*<NavLink*/}
                    {/*  className="edit-delete-buttons"*/}
                    {/*  to={`/deletecourse/${course.id}`}*/}
                    {/*>*/}
                    {/*  <span className="edit-delete-buttons">Delete</span>*/}
                    {/*</NavLink>*/}
                    <DeleteCourseModal
                      course={course}
                      courseInstance={null}
                      type="course"
                    />
                  </div>
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
    <div className="arrow-container">
      <img
        src={arrow}
        alt="arrow"
        className="collapse-arrow"
        id={`toggler${course.id}`}
        width="15px"
      />
    </div>
    <UncontrolledCollapse toggler={`#toggler${course.id}`}>
      <Card className="course-instances-card">
        <CardBody className="course-instances-card-body">
          {course.courses
            .sort((a, b) => (a.year > b.year ? 1 : -1))
            .map(courseInstance => (
              <ListGroup key={courseInstance.id}>
                <ListGroupItem className="single-course-container instance-container">
                  <NavLink
                    to={ROUTES.TIMELINE + courseInstance.id}
                    className="instance-container-name"
                  >
                    <span>{course.name}</span>&nbsp;
                    <b>{courseInstance.year}</b>
                  </NavLink>
                  <div className="courses-right-top-corner-container">
                    {enroll != null &&
                      (!courseInstance.requests ? (
                        <EnrollModal
                          course={course}
                          courseInstance={course.courses[0]}
                        />
                      ) : (
                        <span className="requested">Requested</span>
                      ))}
                    <RoleIcon course={courseInstance} />
                    {/* edit/delete course */}
                    {(isAdmin || course.admin) && (
                      <div className="edit-delete-buttons-instance">
                        <NavLink
                          className="edit-delete-buttons"
                          to={`/editevent/${courseInstance.id}`}
                        >
                          <span className="edit-delete-buttons">Edit</span>
                        </NavLink>
                        <DeleteCourseModal
                          course={course}
                          courseInstance={courseInstance}
                          type="courseInstance"
                        />
                        {/*<NavLink*/}
                        {/*  className="edit-delete-buttons"*/}
                        {/*  to={`/deleteevent/${courseInstance.id}`}*/}
                        {/*>*/}
                        {/*  <span className="edit-delete-buttons">Delete</span>*/}
                        {/*</NavLink>*/}
                      </div>
                    )}
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
    {course.enrolled && getIcon('Student')}
    {course.instructor && getIcon('Teacher')}
    {course.admin && getIcon('Admin')}
  </div>
)

const mapStateToProps = ({ userReducer }) => {
  return {
    user: userReducer.user,
  }
}

const CoursesPage = connect(mapStateToProps)(CoursesPageBase)

export default CoursesPage

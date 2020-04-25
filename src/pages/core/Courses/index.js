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
// import { withAuthorization } from '../../../components/Session'
import { connect } from 'react-redux'
import * as ROUTES from '../../../constants/routes'
import './Courses.css'
import EnrollModal from '../EnrollModal'
import { getIcon } from '../Helper'
import arrow from '../../../images/arrow.svg'

import { axiosRequest, getData } from '../AxiosRequests'
import { BASE_URL, COURSE_INSTANCE_URL, TOKEN } from '../constants'
import DeleteCourseModal from '../DeleteCourseModal'
import { redirect } from '../../../constants/redirect'

class CoursesPageBase extends Component {
  constructor(props) {
    super(props)
    const activeTab = '2'

    this.state = {
      activeTab,
      activeCourses: [], //ActiveCourses, //not (enrolled || teaching || admin) && this semester
      myActiveCourses: [], //MyActiveCourses, //  (enrolled || teaching || admin) && this semester
      myArchivedCourses: [], //MyArchivedCourses, // (enrolled || teaching || admin) && not this semester
      allCourses: [],
    }
  }

  componentDidMount() {
    this.setCourses()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user !== prevProps.user) {
      this.setCourses()
    }
  }

  setCourses = () => {
    const { user } = this.props
    const activeTab = user != null ? '1' : '2'

    this.setState({
      activeTab,
    })

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
            hasAdmin: courseInstance.instanceOf[0].hasAdmin,
          }
        })

        if (user != null) {
          this.setState({
            activeCourses: [],
          })
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

            course.admin = course.hasAdmin
              ? Array.isArray(course.hasAdmin)
                ? course.hasAdmin.findIndex(admin => {
                    return admin === user.fullURI
                  }) > -1
                : course.hasAdmin === user.fullURI
              : false
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
              course.admin = false
              course.enrolled = false
              course.instructor = false
              course.requests = false
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
        startDate: course.startDate,
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
      activeTab,
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
                    active: activeTab === '1',
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
                  active: activeTab === '2',
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
                    active: activeTab === '3',
                  })}
                  onClick={() => {
                    this.toggle('3')
                  }}
                >
                  <span className="tab">Archived Courses</span>
                </NL>
              </NavItem>
            )}
            {user && user.isSuperAdmin && (
              <NavItem>
                <NL
                  className={classnames({
                    active: activeTab === '4',
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

          <TabContent activeTab={activeTab}>
            {user && (
              <TabPane tabId="1">
                <CoursesList
                  coursesList={myActiveCourses}
                  enroll={null}
                  myCourses
                  isAdmin={user ? user.isSuperAdmin : false}
                  user={user}
                  tab="1"
                />
              </TabPane>
            )}
            <TabPane tabId="2">
              <CoursesList
                coursesList={activeCourses}
                enroll={user ? true : null}
                myCourses={false}
                isAdmin={user ? user.isSuperAdmin : false}
                user={user}
                tab="2"
              />
            </TabPane>
            {user && (
              <TabPane tabId="3">
                <CoursesList
                  coursesList={myArchivedCourses}
                  enroll={null}
                  myCourses={false}
                  isAdmin={user ? user.isSuperAdmin : false}
                  user={user}
                  tab="3"
                />
              </TabPane>
            )}
            {user && user.isSuperAdmin && (
              <TabPane tabId="4">
                <CoursesList
                  coursesList={allCourses}
                  enroll={null}
                  myCourses={false}
                  isAdmin={user ? user.isSuperAdmin : false}
                  user={user}
                  tab="4"
                />
              </TabPane>
            )}
          </TabContent>
        </div>
      </main>
    )
  }
}

const CoursesList = ({
  coursesList,
  enroll,
  myCourses,
  isAdmin,
  user,
  tab,
}) => (
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
            {myCourses || isAdmin ? (
              <NavLinkCourse
                course={course}
                to={ROUTES.TIMELINE}
                id={course.courses[0].id}
              />
            ) : (
              <NavLinkCourse course={course} to={''} />
            )}

            <div className="courses-right-top-corner-container">
              <RoleIcon course={course.courses[0]} />
              {enroll != null &&
                (!course.courses[0].requests ? (
                  <EnrollModal
                    user={user}
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
                {user && (course.admin || user.isSuperAdmin) ? (
                  <NavLinkCourse
                    course={course}
                    to={ROUTES.COURSE_ID}
                    id={course.id}
                  />
                ) : (
                  <>
                    <span className="name">{course.name}</span>
                    <br />
                    <span className="about">{course.desc}</span>
                  </>
                )}
                {/*<span className="name">{course.name}</span>*/}
                {/*<br />*/}
                {/*<span className="about">{course.desc}</span>*/}
              </div>
              <div className="courses-right-top-corner-container">
                {course.admin === true && getIcon('Admin')}
                {(isAdmin || course.admin) && (
                  <div className="edit-delete-buttons-container">
                    <NavLink
                      className="edit-delete-buttons"
                      to={redirect(ROUTES.EDIT_COURSE_ID, [
                        { key: 'course_id', value: course.id },
                      ])}
                    >
                      <span className="edit-delete-buttons">Edit</span>
                    </NavLink>
                    {/*<DeleteCourseModal*/}
                    {/*  course={course}*/}
                    {/*  courseInstance={null}*/}
                    {/*  type="course"*/}
                    {/*  small=""*/}
                    {/*/>*/}
                  </div>
                )}
              </div>
            </div>
            <CollapsableCourse
              course={course}
              enroll={enroll}
              myCourses={myCourses}
              isAdmin={isAdmin}
              user={user}
              className="collapsable-container"
              tab={tab}
            />
          </>
        )}
      </ListGroupItem>
    ))}
  </ListGroup>
)

const NavLinkCourse = ({ course, to, id }) => (
  <>
    <NavLink to={redirect(to, [{ key: 'course_id', value: id }])}>
      <span className="name">{course.name}</span>
      <br />
      <span className="about">{course.desc}</span>
    </NavLink>
  </>
)

const NavLinkCourseInstance = ({ course, courseInstance, to }) => (
  <>
    <NavLink
      to={redirect(to, [{ key: 'course_id', value: course.courses[0].id }])}
      className="instance-container-name"
    >
      <span>{course.name}</span>&nbsp;
      <b>{new Date(courseInstance.startDate).getFullYear()}</b>
    </NavLink>
  </>
)

const CollapsableCourse = ({
  course,
  enroll,
  myCourses,
  isAdmin,
  user,
  tab,
}) => (
  <div>
    <div className="arrow-container">
      <img
        src={arrow}
        alt="arrow"
        className="collapse-arrow"
        id={`toggler${course.id}${tab}`}
        width="15px"
      />
    </div>
    <UncontrolledCollapse toggler={`#toggler${course.id}${tab}`}>
      <Card className="course-instances-card">
        <CardBody className="course-instances-card-body">
          {course.courses
            .sort((a, b) => (a.year > b.year ? 1 : -1))
            .map(courseInstance => (
              <ListGroup key={courseInstance.id}>
                <ListGroupItem className="single-course-container instance-container">
                  {myCourses || isAdmin ? (
                    <NavLinkCourseInstance
                      course={course}
                      courseInstance={courseInstance}
                      to={ROUTES.TIMELINE}
                    />
                  ) : (
                    <NavLinkCourseInstance
                      course={course}
                      courseInstance={courseInstance}
                      to={''}
                    />
                  )}

                  <div className="courses-right-top-corner-container">
                    {enroll != null &&
                      (!courseInstance.requests ? (
                        <EnrollModal
                          user={user}
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
                          //TODO edit courseInstance
                          to={redirect(ROUTES.EDIT_EVENT_ID, [
                            { key: 'event_id', value: courseInstance.id },
                            { key: 'course_id', value: course.courses[0].id },
                          ])}
                        >
                          <span className="edit-delete-buttons">Edit</span>
                        </NavLink>
                        <DeleteCourseModal
                          course={course}
                          courseInstance={courseInstance}
                          type="courseInstance"
                          small="small-delete-button"
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

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

const CoursesPage = connect(mapStateToProps)(CoursesPageBase)

export default CoursesPage

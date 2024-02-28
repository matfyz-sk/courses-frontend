import React, { useState } from 'react'
import {
  Nav,
  NavItem,
  TabContent,
  NavLink as NL,
  TabPane,
  Button,
  Alert,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import './Courses.css'
import { getShortId } from '../Helper'
import { NEW_COURSE } from '../../../constants/routes'
import { CoursesList } from './CoursesList'
import { useGetCourseQuery, useGetCourseInstanceQuery } from 'services/course'

function CoursesPageBase(props) {
  const { user } = props
  const [activeTab, setActiveTab] = useState(user ? '1' : '2')
  const {
    data: courseInstancesData,
    isSuccess: courseInstancesIsSuccess,
    isLoading
  } = useGetCourseInstanceQuery({})
  const {
    data: coursesData,
    isSuccess: coursesIsSuccess
  } = useGetCourseQuery({})

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let activeCourses = []      //NOT (enrolled || teaching || admin) && this semester
  let myActiveCourses = []    //    (enrolled || teaching || admin) && this semester
  let myArchivedCourses = []  //    (enrolled || teaching || admin) && NOT this semester
  let allCourses = []
  if (courseInstancesIsSuccess && courseInstancesData) {
    const courses = courseInstancesData.map(courseInstance => {
      return {
        id: courseInstance['_id'].substring(
          courseInstance['_id'].length - 5
        ),
        fullId: courseInstance['_id'],
        year: courseInstance.year,
        name: courseInstance.course.name,
        abbreviation: courseInstance.course.abbreviation,
        description: courseInstance.course.description,
        courseId: courseInstance.course['_id'].substring(
          courseInstance.course['_id'].length - 5
        ),
        startDate: courseInstance.startDate,
        endDate: courseInstance.endDate,
        hasAdmin: courseInstance.course.hasAdmin,
        hasInstructor: courseInstance.hasInstructor,
        hasPersonalSettings: courseInstance.hasPersonalSettings,
      }
    })

    if (user) {
      adjustCoursesData(courses, user)
      for (const course of courses) {
        if (
          course.enrolled === true ||
          course.instructor === true ||
          course.admin === true
        ) {
          if (
            new Date(course.startDate.representation) <= new Date() &&
            new Date(course.endDate.representation) > new Date()
          ) {
            myActiveCourses.push(course)
          } else if (new Date(course.endDate.representation) < new Date()) {
            myArchivedCourses.push(course)
          }
        } else if (
          new Date(course.startDate.representation) <= new Date() &&
          new Date(course.endDate.representation) > new Date()
        ) {
          activeCourses.push(course)
        }
      }
      activeCourses = groupCourses(activeCourses)
      myActiveCourses = groupCourses(myActiveCourses)
      myArchivedCourses = groupCourses(myArchivedCourses)
      allCourses = groupCourses(courses)

      
      if (coursesIsSuccess && coursesData) {
        const courseIds = courses.map(c => c.courseId)
        const coursesToAdd = []
        for (const course of coursesData) {
          if (!courseIds.includes(getShortId(course['_id']))) {
            coursesToAdd.push(course)
          }
        }

        for (const course of coursesToAdd) {
          const admins = course.hasAdmin.map(a => getShortId(a['_id']))
          const courseToAdd = {
            id: getShortId(course['_id']),
            fullId: course['_id'],
            name: course.name,
            desc: course.description,
            abbr: course.abbreviation,
            courses: [],
            admin: admins.includes(user.id),
          }
          allCourses.push(courseToAdd)
          if (courseToAdd.admin) {
            myActiveCourses.push(courseToAdd)
          }
        }
      }
    } else {
      let activeCourses = []
      for (const course of courses) {
        if (
          new Date(course.startDate.representation) <= new Date() &&
          new Date(course.endDate.representation) > new Date()
        ) {
          course.admin = false
          course.enrolled = false
          course.instructor = false
          course.requests = false
          activeCourses.push(course)
        }
      }
      activeCourses = groupCourses(activeCourses)
    }
  }


  return (
    <main className="courses_main">
      <div className="courses">
        <Nav
          tabs
          className={user && user.isSuperAdmin ? 'admin-tabs tabs' : 'tabs'}
        >
          {user && (
            <NavItem>
              <NL
                className={classnames({
                  active: activeTab === '1',
                })}
                onClick={() => {
                  toggle('1')
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
                toggle('2')
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
                  toggle('3')
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
                  toggle('4')
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
      {user && user.isSuperAdmin && (
        <NavLink to={NEW_COURSE} className="new-course-button-container">
          <Button className="new-course-button">New Course</Button>
        </NavLink>
      )}
    </main>
  )
}

const adjustCoursesData = (courses, user) => {
  for (const course of courses) {
    course.enrolled =
      user.studentOf.findIndex(userEnrolledCourse => {
        return userEnrolledCourse['_id'] === course.fullId
      }) > -1

    course.requests =
      user.requests.findIndex(userRequestedCourse => {
        return userRequestedCourse['_id'] === course.fullId
      }) > -1

    // eslint-disable-next-line no-nested-ternary
    course.instructor = course.hasInstructor
      ? Array.isArray(course.hasInstructor)
        ? course.hasInstructor
            .map(instructor => instructor['_id'])
            .findIndex(instructor => {
              return instructor === user.fullURI
            }) > -1
        : course.hasInstructor === user.fullURI
      : false

    // eslint-disable-next-line no-nested-ternary
    course.admin = course.hasAdmin
      ? Array.isArray(course.hasAdmin)
        ? course.hasAdmin.includes(user.fullURI)
        : course.hasAdmin === user.fullURI
      : false
  }
}

const groupCourses = courses => {
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
      hasPersonalSettings: course.hasPersonalSettings,
    })
  }
  return Object.keys(groupedCourses).map(function (key) {
    return groupedCourses[key]
  })
}

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

const CoursesPage = connect(mapStateToProps)(CoursesPageBase)

export default CoursesPage

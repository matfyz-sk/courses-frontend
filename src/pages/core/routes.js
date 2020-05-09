import React from 'react'
import { Route } from 'react-router-dom'
import LandingPage from './Landing'
import CoursesPage from './Courses'
import Course from './Course'
import Assignments from '../assignments'
import Event from './Event'
import Timeline from './Timeline'
import CreateTimeline from './CreateTimeline'
import NewCourse from './NewCourse'
import UserManagement from './UserManagement'
import NewEvent from './NewEvent'
import EditEvent from './EditEvent'
import EditCourse from './EditCourse'
import RouteWrapper from '../../router/routes/RouteWrapper'
import SuperAdminRoute from '../../router/routes/SuperAdminRoute'
import AdminRoute from '../../router/routes/AdminRoute'
import InstructorRoute from '../../router/routes/InstructorRoute'
import StudentRoute from '../../router/routes/StudentRoute'
import * as ROUTES from '../../constants/routes'
import CourseMigration from './CourseMigration'
import CourseLayout from '../../layouts/CourseLayout'
import PrivateOnlyRoute from '../../router/routes/PrivateOnlyRoute'
import Teams from './Teams'
import Profile from './Profile'
import TeamDetail from './Teams/TeamDetail'
import NewCourseInstance from './NewCourseInstance'
import InfoPage from './InfoPage'

const CoreRoutes = [
  <RouteWrapper
    key={ROUTES.DASHBOARD}
    path={ROUTES.DASHBOARD}
    component={LandingPage}
    layout={CourseLayout}
    auth
  />,
  <StudentRoute
    key={ROUTES.TIMELINE}
    path={ROUTES.TIMELINE}
    component={Timeline}
    layout={CourseLayout}
    auth
  />,
  <RouteWrapper
    key={ROUTES.COURSE_TEAM_CREATE}
    path={ROUTES.COURSE_TEAM_CREATE}
    component={TeamDetail}
    layout={CourseLayout}
    exact
    auth
  />,
  <RouteWrapper
    key={ROUTES.COURSE_TEAM_DETAIL}
    path={ROUTES.COURSE_TEAM_DETAIL}
    component={TeamDetail}
    layout={CourseLayout}
    exact
    auth
  />,
  <RouteWrapper
    key={ROUTES.COURSE_TEAMS}
    path={ROUTES.COURSE_TEAMS}
    component={Teams}
    layout={CourseLayout}
    exact
    auth
  />,
  <PrivateOnlyRoute
    key={ROUTES.PROFILE_SETTINGS}
    path={ROUTES.PROFILE_SETTINGS}
    component={Profile}
  />,

  <PrivateOnlyRoute
    key="/dashboard"
    path="/dashboard"
    component={LandingPage}
  />,

  <InstructorRoute
    key={ROUTES.CREATE_TIMELINE}
    path={ROUTES.CREATE_TIMELINE}
    component={CreateTimeline}
    layout={CourseLayout}
  />,
  <StudentRoute
    key={ROUTES.EVENT_ID}
    path={ROUTES.EVENT_ID}
    component={Event}
    layout={CourseLayout}
    auth
  />,
  <InstructorRoute
    key={ROUTES.EDIT_EVENT_ID}
    path={ROUTES.EDIT_EVENT_ID}
    component={EditEvent}
    layout={CourseLayout}
  />,
  <InstructorRoute
    key={ROUTES.NEW_EVENT}
    path={ROUTES.NEW_EVENT}
    component={NewEvent}
    layout={CourseLayout}
  />,
  <InstructorRoute
    key={ROUTES.USER_MANAGEMENT}
    path={ROUTES.USER_MANAGEMENT}
    component={UserManagement}
    layout={CourseLayout}
  />,
  <InstructorRoute
    key={ROUTES.COURSE_MIGRATION}
    path={ROUTES.COURSE_MIGRATION}
    component={CourseMigration}
    layout={CourseLayout}
  />,
  <RouteWrapper
    key={ROUTES.ASSIGNMENTS}
    path={ROUTES.ASSIGNMENTS}
    component={Assignments}
    layout={CourseLayout}
    auth
  />,
  <Route key={ROUTES.COURSES} path={ROUTES.COURSES} component={CoursesPage} />,
  <Route key={ROUTES.INFO_PAGE} path={ROUTES.INFO_PAGE} component={InfoPage} />,
  <AdminRoute
    key={ROUTES.COURSE_ID}
    path={ROUTES.COURSE_ID}
    component={Course}
  />,
  <SuperAdminRoute
    key={ROUTES.NEW_COURSE}
    path={ROUTES.NEW_COURSE}
    component={NewCourse}
  />,
  <AdminRoute
    key={ROUTES.EDIT_COURSE_ID}
    path={ROUTES.EDIT_COURSE_ID}
    component={EditCourse}
  />,
  <AdminRoute
    key={ROUTES.NEW_COURSE_INSTANCE}
    path={ROUTES.NEW_COURSE_INSTANCE}
    component={NewCourseInstance}
  />,
]

export default CoreRoutes

import React from 'react';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router';
import LandingPage from './Landing';
import CoursesPage from './Courses';
import Event from './Event';
import Timeline from './Timeline';
import CreateTimeline from './CreateTimeline';
import NewCourse from './NewCourse';
import UserManagement from './UserManagement';
import NewEvent from './NewEvent';
import EditEvent from './EditEvent';
import EditCourse from './EditCourse';
import RouteWrapper from '../../router/routes/RouteWrapper';
import * as ROUTES from '../../constants/routes';
import CourseMigration from './CourseMigration';
import { coursePrefix } from '../../constants/prefix';
import MainPage from '../mainPage';
import CourseLayout from '../../layouts/CourseLayout';
import PrivateOnlyRoute from "../../router/routes/PrivateOnlyRoute";

const CoreRoutes = [
  <RouteWrapper path={ROUTES.DASHBOARD} component={LandingPage} layout={CourseLayout} auth />,
  <RouteWrapper path={ROUTES.TIMELINE_ID} component={Timeline} layout={CourseLayout} auth />,
  <PrivateOnlyRoute path="/dashboard" component={LandingPage} />,

  <Route path={ROUTES.COURSES} component={CoursesPage} />,

  <Route path={ROUTES.CREATE_TIMELINE_ID} component={CreateTimeline} />,
  <Route path={ROUTES.EVENT_ID} component={Event} />,
  <Route path={ROUTES.EDIT_EVENT_ID} component={EditEvent} />,
  <Route path={ROUTES.EDIT_COURSE_ID} component={EditCourse} />,
  <Route path={ROUTES.NEW_EVENT} component={NewEvent} />,
  <Route path={ROUTES.NEW_COURSE} component={NewCourse} />,
  <Route path={ROUTES.USER_MANAGEMENT_ID} component={UserManagement} />,
  <Route path={ROUTES.COURSE_MIGRATION_ID} component={CourseMigration} />,
];

export default CoreRoutes;

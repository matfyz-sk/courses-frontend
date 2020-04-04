import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LandingPage from '../../pages/core/Landing';
import CoursesPage from '../../pages/core/Courses';
import Event from '../../pages/core/Event';
import Timeline from '../../pages/core/Timeline';
import CreateTimeline from '../../pages/core/CreateTimeline';
import NewCourse from '../../pages/core/NewCourse';
import Assignments from '../../pages/assignments'
import UserManagement from "../../pages/core/UserManagement";
import NewEvent from "../../pages/core/NewEvent";
import EditEvent from "../../pages/core/EditEvent";
import EditCourse from "../../pages/core/EditCourse";

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { withCourse } from '../Session';
import { compose } from "recompose";
import CourseMigration from "../../pages/core/CourseMigration";

const AppBase = () => (
    <BrowserRouter>
        <div>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.COURSES} component={CoursesPage} />
            <Route path={ROUTES.TIMELINE_ID} component={Timeline} />
            <Route path={ROUTES.CREATE_TIMELINE_ID} component={CreateTimeline} />
            <Route path={ROUTES.EVENT_ID} component={Event} />
            <Route path={ROUTES.EDIT_EVENT_ID} component={EditEvent} />
            <Route path={ROUTES.EDIT_COURSE_ID} component={EditCourse} />
            <Route path={ROUTES.NEW_EVENT} component={NewEvent} />
            <Route path={ROUTES.NEW_COURSE} component={NewCourse} />
            <Route path={ROUTES.USER_MANAGEMENT_ID} component={UserManagement} />
            <Route path={ROUTES.COURSE_MIGRATION_ID} component={CourseMigration} />
            <Route path={ROUTES.ASSIGNMENTS} component={Assignments} />
        </div>
    </BrowserRouter>
);

const App = compose(
    withCourse,
    withAuthentication,
)(AppBase);

export default App;

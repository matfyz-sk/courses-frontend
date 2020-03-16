import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LandingPage from '../../pages/core/Landing';
import CoursesPage from '../../pages/core/Courses';
import Timeline from '../../pages/core/Timeline';
import NewCourse from '../../pages/core/NewCourse';
import Assignments from '../../pages/assignments'
import UserManagement from "../../pages/core/UserManagement";

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import { withCourse } from '../Session';
import { compose } from "recompose";

const AppBase = () => (
    <BrowserRouter>
        <div>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.COURSES} component={CoursesPage} />
            <Route path={ROUTES.TIMELINE_ID} component={Timeline} />
            <Route path={ROUTES.NEW_COURSE} component={NewCourse} />
            <Route path={ROUTES.USER_MANAGEMENT} component={UserManagement} />
            <Route path={ROUTES.ASSIGNMENTS} component={Assignments} />
        </div>
    </BrowserRouter>
);

const App = compose(
    withCourse,
    withAuthentication,
)(AppBase);

export default App;

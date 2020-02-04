import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LandingPage from '../../pages/core/Landing';
import SignUpPage from '../../pages/core/SignUp';
import SignInPage from '../../pages/core/SignIn';
import PasswordForgetPage from '../../pages/core/PasswordForget';
import CoursesPage from '../../pages/core/Courses';
import Timeline from '../../pages/core/Timeline';
import AccountPage from '../../pages/core/Account';
import AdminPage from '../../pages/core/Admin';
// import Assignments from '../../pages/assignments'

import * as ROUTES from '../../constants/routes';
import Navigation from "../Navigation";
import { withAuthentication } from '../Session';
import { withCourse } from '../Session';
import { compose } from "recompose";

import { connect } from "react-redux";
import { setUserAdmin } from "../../redux/actions";

const AppBase = () => (
    <BrowserRouter>
        <div>
            <Navigation/>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.COURSES} component={CoursesPage} />
            <Route path={ROUTES.TIMELINE_ID} component={Timeline} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            {/*<Route path={ROUTES.ASSIGNMENTS} component={Assignments} />*/}
        </div>
    </BrowserRouter>
);

const mapStateToProps = ( { userReducer } ) => {
    return { isAdmin: userReducer.isAdmin };
    // const { isAdmin } = userReducer;
    // return { isAdmin };
};

const App = compose(
    connect(mapStateToProps, { setUserAdmin }),
    withCourse,
    withAuthentication,
)(AppBase);

export default App;

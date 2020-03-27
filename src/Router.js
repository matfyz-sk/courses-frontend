import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import MainPage from "./pages/mainPage";
import Results from "./pages/results";
import Quiz from "./pages/quiz";
import Assignments from "./pages/assignments";
import Files from "./pages/files";
import Info from "./pages/info";
import Lectures from "./pages/lectures";
import Labs from "./pages/labs";
import PrivacySettings from "./pages/profileSettings/PrivacySettings";
import ProfileSettings from "./pages/profileSettings/ProfileSettings";
import Layout from "./Layout";
import Page404 from "./errors/404page";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import PrivacyPolicyDocument from "./pages/documents/PrivacyPolicyDocument";
import CookieDocument from "./pages/documents/CookieDocument";
import PersonDetail from "./pages/profiles/PersonDetail";
import Dashboard from "./pages/dashboard";

import Courses from "./pages/courses";
import CoursesDetail from "./pages/courses/pages";
import CoursesArticles from "./pages/courses/pages/course-articles";
import CoursesBadges from "./pages/courses/pages/course-badges";
import CoursesTeams from "./pages/courses/pages/course-teams";
import CoursesStudents from "./pages/courses/pages/course-students";
import CoursesTeachers from "./pages/courses/pages/course-teachers";
import CoursesTeamsDetail from "./pages/courses/pages/course-teams-detail";
import CoursesStudentsDetail from "./pages/courses/pages/course-students-detail";
import CoursesOptionsTeam from "./pages/courses/pages/course-options-team";
import CoursesOptionsPoints from "./pages/courses/pages/course-options-points";
import CoursesPointsAssignment from "./pages/courses/pages/course-points-assignment";

import PrivateRoute from "./PrivateRouter";
import PublicOnlyRoute from "./PublicOnlyRouter";

const Router = () => (
    <BrowserRouter>
        <div>
            <Layout>
                <Switch>
                    {/** CORE **/}
                    <PrivateRoute exact path='/dashboard' component={Dashboard} />
                    <Route path='/assignments' component={props => <Assignments {...props} />} />
                    <Route exact path='/files' component={Files} />
                    <Route exact path='/info' component={Info} />
                    <Route exact path='/labs' component={Labs} />
                    <Route exact path='/lectures' component={Lectures} />
                    <Route exact path='/quiz' component={Quiz} />
                    <Route exact path='/results' component={Results} />

                    <Route exact path='/courses/detail/options/team/:article' component={CoursesOptionsTeam} />
                    <Route exact path='/courses/detail/options/team' component={CoursesOptionsTeam} />
                    <Route exact path='/courses/detail/options/points/:article' component={CoursesOptionsPoints} />
                    <Route exact path='/courses/detail/points/:article' component={CoursesPointsAssignment} />

                    <Route exact path='/courses/detail/teachers' component={CoursesTeachers} />
                    <Route exact path='/courses/detail/students/detail' component={CoursesStudentsDetail} />
                    <Route exact path='/courses/detail/students' component={CoursesStudents} />
                    <Route exact path='/courses/detail/teams/detail' component={CoursesTeamsDetail} />
                    <Route exact path='/courses/detail/teams' component={CoursesTeams} />
                    <Route exact path='/courses/detail/badges' component={CoursesBadges} />
                    <Route exact path='/courses/detail/articles' component={CoursesArticles} />
                    <Route exact path='/courses/detail' component={CoursesDetail} />
                    <Route exact path='/courses' component={Courses} />

                    <Route exact path='/privacy-settings' component={PrivacySettings} />
                    <Route exact path='/profile-settings' component={ProfileSettings} />
                    {/** AUTH **/}
                    <PublicOnlyRoute exact path="/login" component={LoginPage} />
                    <PublicOnlyRoute exact path="/register" component={RegisterPage} />
                    {/** VISITOR **/}
                    <Route exact path="/profile/:pattern" component={PersonDetail} />
                    <Route exact path="/privacy-policy" component={PrivacyPolicyDocument} />
                    <Route exact path="/cookies" component={CookieDocument} />
                    <Route exact path="/" component={MainPage} />
                    {/** ERROR **/}
                    <Route component={Page404} />
                </Switch>
            </Layout>
        </div>
    </BrowserRouter>
);

export default Router;
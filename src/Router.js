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
import PrivateRoute from "./PrivateRouter";

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
                    <Route exact path='/privacy-settings' component={PrivacySettings} />
                    <Route exact path='/profile-settings' component={ProfileSettings} />
                    {/** AUTH **/}
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
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
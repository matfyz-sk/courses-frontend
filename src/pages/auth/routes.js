import React from 'react'
import PublicOnlyRoute from '../../router/routes/PublicOnlyRoute'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import * as ROUTES from '../../constants/routes'
import RegisterCompletion from './RegisterCompletion'
import PrivateOnlyRoute from '../../router/routes/PrivateOnlyRoute'

const AuthRoutes = [
  <PublicOnlyRoute key="/login" exact path="/login" component={LoginPage} />,
  <PublicOnlyRoute
    key="/register"
    exact
    path="/register"
    component={RegisterPage}
  />,
  <PrivateOnlyRoute
    key="/register-completion"
    exact
    path={ROUTES.REGISTER_COMPLETION}
    component={RegisterCompletion}
  />,
]

export default AuthRoutes

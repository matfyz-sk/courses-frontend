import React from 'react';
import PublicOnlyRoute from '../../router/routes/PublicOnlyRoute';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const AuthRoutes = [
  <PublicOnlyRoute exact path="/login" component={LoginPage} />,
  <PublicOnlyRoute exact path="/register" component={RegisterPage} />,
];

export default AuthRoutes;

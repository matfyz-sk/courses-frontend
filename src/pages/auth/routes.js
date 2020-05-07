import React from 'react';
import PublicOnlyRoute from '../../router/routes/PublicOnlyRoute';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const AuthRoutes = [
  <PublicOnlyRoute key='/login' exact path="/login" component={LoginPage} />,
  <PublicOnlyRoute key='/register' exact path="/register" component={RegisterPage} />,
];

export default AuthRoutes;

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import MainPage from '../pages/mainPage';
import Page404 from '../pages/errors/Page404';

import CoreRoutes from '../pages/core/routes';
import QuizRoutes from '../pages/quiz/routes';
import AuthRoutes from '../pages/auth/routes';

const Router = () => (
  <BrowserRouter>
    <div>
      <MainLayout>
        <Switch>
          {AuthRoutes}
          {QuizRoutes}
          {CoreRoutes}
          <Route exact path="/" component={MainPage} />
          <Route component={Page404} />
        </Switch>
      </MainLayout>
    </div>
  </BrowserRouter>
);



export default Router;

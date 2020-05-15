import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import MainPage from '../pages/mainPage'
import Page404 from '../pages/errors/Page404'

import CoreRoutes from '../pages/core/routes'
import QuizRoutes from '../pages/quiz/routes'
import AuthRoutes from '../pages/auth/routes'
import * as ROUTES from '../constants/routes'
import Page401 from '../pages/errors/Page401'
import PublicProfile from '../pages/core/PublicProfile'

const Router = () => (
  <BrowserRouter>
    <div>
      <MainLayout>
        <Switch>
          {AuthRoutes}
          {QuizRoutes}
          {CoreRoutes}
          <Route
            key={ROUTES.ACCESS_DENIED}
            path={ROUTES.ACCESS_DENIED}
            component={Page401}
          />
          <Route
            key={ROUTES.NOT_FOUND}
            path={ROUTES.NOT_FOUND}
            component={Page404}
          />
          <Route key="/profile" exact path={ROUTES.PUBLIC_PROFILE} component={PublicProfile} />
          <Route key="/" exact path="/" component={MainPage} />
          <Route key="404" component={Page404} />
        </Switch>
      </MainLayout>
    </div>
  </BrowserRouter>
)

export default Router

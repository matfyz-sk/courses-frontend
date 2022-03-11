import React from 'react'
import * as ROUTES from '../../constants/routes'
import Quiz from './index'
import RouteWrapper from '../../router/routes/RouteWrapper'
import CourseLayout from '../../layouts/CourseLayout'

const QuizRoutes = [
  <RouteWrapper
    key={ ROUTES.QUIZ }
    path={ ROUTES.QUIZ }
    component={ Quiz }
    layout={ CourseLayout }
    auth
  />,
];

export default QuizRoutes;

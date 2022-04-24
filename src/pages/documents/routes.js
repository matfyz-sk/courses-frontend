import React from 'react'
import * as ROUTES from '../../constants/routes'
import Documents from './index'
import InstructorRoute from '../../router/routes/InstructorRoute'
import CourseLayout from '../../layouts/CourseLayout'


const DocumentsRoutes = [
  <InstructorRoute
    key={ROUTES.DOCUMENTS}
    path={ROUTES.DOCUMENTS}
    component={Documents}
    layout={CourseLayout}
    auth
  />,
];

export default DocumentsRoutes;

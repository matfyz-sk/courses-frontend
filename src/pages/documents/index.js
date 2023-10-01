import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import DocumentHistory from './DocumentHistory'
import DocumentForm from './DocumentForm'
import { DocumentEnums } from './common/enums/document-enums'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import Page404 from '../errors/Page404'
import { getShortID } from '../../helperFunctions'
import CourseDocumentManager from './CourseDocumentsManager'

function DocumentsNavigation({ match, courseInstance }) {
  const [loading, setLoading] = useState(true)
  const courseId = match.params.course_id

  useEffect(() => {
    if (courseInstance && getShortID(courseInstance["_id"]) === courseId) {
      setLoading(false)
    }
    else {
      setLoading(true)
    }
  }, [courseInstance, courseId])

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <Switch>
      <Route exact path={ROUTES.DOCUMENTS}>
        <Redirect
          to={redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
            { key: 'course_id', value: courseId },
            {
              key: 'folder_id',
              value: getShortID(courseInstance.fileExplorerRoot[0]['_id']),
            },
          ])}
        />
      </Route>
      <Route
        exact
        path={ROUTES.DOCUMENTS_IN_FOLDER}
        render={() => <CourseDocumentManager showingDeleted={false} />}
      />
      <Route
        exact
        path={ROUTES.DELETED_DOCUMENTS}
        render={() => <CourseDocumentManager showingDeleted={true} />}
      />
      <Route
        exact
        path={ROUTES.EDIT_DOCUMENT}
        render={() => <DocumentForm />}
      />
      <Route
        exact
        path={ROUTES.CREATE_INTERNAL_DOCUMENT}
        render={() => (
          <DocumentForm creating={DocumentEnums.internalDocument.entityName} />
        )}
      />
      <Route
        exact
        path={ROUTES.CREATE_EXTERNAL_DOCUMENT}
        render={() => (
          <DocumentForm creating={DocumentEnums.externalDocument.entityName} />
        )}
      />
      <Route
        exact
        path={ROUTES.CREATE_FILE_DOCUMENT}
        render={() => <DocumentForm creating={DocumentEnums.file.entityName} />}
      />
      <Route
        exact
        path={ROUTES.DOCUMENT_HISTORY}
        render={() => <DocumentHistory />}
      />
      <Route key="404" component={Page404} />
    </Switch>
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, {})(DocumentsNavigation)
)

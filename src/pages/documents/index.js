import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap'
import DocumentHistory from './DocumentHistory'
import DocumentForm from './DocumentForm'
import { DocumentEnums } from './enums/document-enums'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import Page404 from '../errors/Page404'
import { getShortID } from '../../helperFunctions'
import CourseDocumentManager from './CourseDocumentsManager'
import { fetchFolder } from '../../redux/actions'

function DocumentsNavigation({ match, courseInstance, folder, fetchFolder }) {
  const [loading, setLoading] = useState(true)
  const courseId = match.params.course_id

  useEffect(() => {
    if (courseInstance && folder.id) {
      setLoading(false)
    } else {
      setLoading(true)
      if (
        courseInstance &&
        courseInstance.fileExplorerRoot.length !== 0 &&
        !folder.id
      ) {
        fetchFolder(getShortID(courseInstance.fileExplorerRoot[0]['@id']))
      }
    }
  }, [courseInstance, folder.id])

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  // if (courseInstance && courseInstance.fileExplorerRoot.length === 0) {
  //     // TODO initializeFileSystem() // means creating root folder for the courseInstance and setting redux state
  //     // TODO remove if possible
  //     return (
  //         <Alert color="secondary" className="empty-message">
  //             Initializing file system...
  //         </Alert>
  //     )
  // }
  return (
    <Switch>
      <Route exact path={ROUTES.DOCUMENTS}>
        <Redirect
          to={redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
            { key: 'course_id', value: courseId },
            {
              key: 'folder_id',
              value: getShortID(courseInstance.fileExplorerRoot[0]['@id']),
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

const mapStateToProps = ({ courseInstanceReducer, folderReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    folder: { ...folderReducer },
  }
}

export default withRouter(
  connect(mapStateToProps, {fetchFolder})(DocumentsNavigation)
)

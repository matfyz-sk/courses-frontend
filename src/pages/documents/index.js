import React from "react"
import { Redirect, Route, Switch, withRouter } from "react-router-dom"
import DocumentHistory from "./DocumentHistory"
import DocumentForm from "./DocumentForm"
import * as ROUTES from "../../constants/routes"
import { redirect } from "../../constants/redirect"
import Page404 from "../errors/Page404"
import { getShortID } from "../../helperFunctions"
import CourseDocumentManager from "./CourseDocumentsManager"
import { Alert } from "@material-ui/lab"
import { useGetCourseInstanceQuery } from "../../services/course"
import { DATA_PREFIX } from "../../constants/ontology"

function DocumentsNavigation({ match }) {
    const courseId = match.params.course_id
    const courseInstanceFullId = `${DATA_PREFIX}courseInstance/${courseId}`
    const { data: courseInstanceData, isFetching } = useGetCourseInstanceQuery(
        { id: courseInstanceFullId },
        { skip: !courseId }
    )
    const courseInstance = courseInstanceData?.[0] ?? {}

    if (isFetching) {
        return (
            <Alert color="success" className="empty-message">
                Loading...
            </Alert>
        )
    }

    return (
        <Switch>
            <Route exact path={ROUTES.DOCUMENTS}>
                <Redirect
                    to={redirect(ROUTES.DOCUMENTS_IN_FOLDER, [
                        { key: "course_id", value: courseId },
                        {
                            key: "folder_id",
                            value: getShortID(courseInstance.fileExplorerRoot["_id"]),
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
            <Route exact path={ROUTES.EDIT_DOCUMENT} render={() => <DocumentForm />} />
            <Route exact path={ROUTES.DOCUMENT_HISTORY} render={() => <DocumentHistory />} />
            <Route key="404" component={Page404} />
        </Switch>
    )
}

export default withRouter(DocumentsNavigation)

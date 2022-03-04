import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import DocumentsManager from './DocumentManager'
import DocumentHistory from './DocumentHistory'
import DocumentForm from './DocumentForm'
import { DocumentEnums } from './enums/document-enums'
import * as ROUTES from '../../constants/routes'
import Page404 from '../errors/Page404';

function DocumentsNavigation(props) {
    return (
        <Switch>
            <Route exact path={ROUTES.DOCUMENTS} render={() => <DocumentsManager showingDeleted={false}/>}/>
            <Route exact path={ROUTES.DELETED_DOCUMENTS} render={() => <DocumentsManager showingDeleted={true}/>}/>
            <Route exact path={ROUTES.EDIT_DOCUMENT} render={() => <DocumentForm />}/>
            <Route exact path={ROUTES.CREATE_INTERNAL_DOCUMENT}
             render={() => <DocumentForm entityName={DocumentEnums.internalDocument.entityName}/>}/>
            <Route exact path={ROUTES.CREATE_EXTERNAL_DOCUMENT} 
             render={() => <DocumentForm entityName={DocumentEnums.externalDocument.entityName}/>}/>
            <Route exact path={ROUTES.CREATE_FILE_DOCUMENT}  
             render={() => <DocumentForm entityName={DocumentEnums.file.entityName}/>}/>
            <Route exact path={ROUTES.DOCUMENT_HISTORY} render={() => <DocumentHistory/>}/>
            <Route key="404" component={Page404} />
        </Switch>
    )
}

const mapStateToProps = (state) => {
    return state;
}
  
export default withRouter(connect(mapStateToProps)(DocumentsNavigation))